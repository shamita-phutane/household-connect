package com.backend.booking.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.booking.dto.BookingRequestDto;
import com.backend.booking.dto.BookingResponseDto;
import com.backend.booking.entity.Booking;
import com.backend.booking.repository.BookingRepository;
import com.backend.common.enums.BookingStatus;
import com.backend.common.enums.Role;
import com.backend.exception.InvalidRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {

        User customer = userRepository.findById(requestDto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with id: " + requestDto.getCustomerId()));

        Booking booking = Booking.builder()
                .date(requestDto.getDate())
                .bookingTime(requestDto.getBookingTime())
                .finalAmount(requestDto.getFinalAmount())
                .serviceAddress(requestDto.getServiceAddress())
                .status(BookingStatus.PENDING)
                .customer(customer)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }

    @Override
    public BookingResponseDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return convertToResponse(booking);
    }

    @Override
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomer_UserId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByPartner(Long partnerId) {
        return bookingRepository.findByPartner_UserId(partnerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDto assignPartner(Long bookingId, Long partnerId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with id: " + partnerId));

        if (partner.getRole() != Role.PARTNER) {
            throw new InvalidRequestException("User with id " + partnerId + " is not a PARTNER");
        }

        booking.setPartner(partner);

        Booking updatedBooking = bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponseDto updateStatus(Long bookingId, BookingStatus status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(status);

        Booking updatedBooking = bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        bookingRepository.delete(booking);
    }

    private BookingResponseDto convertToResponse(Booking booking) {
        BookingResponseDto.BookingResponseDtoBuilder builder = BookingResponseDto.builder()
                .bookingId(booking.getBookingId())
                .date(booking.getDate())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .finalAmount(booking.getFinalAmount())
                .serviceAddress(booking.getServiceAddress())
                .customerId(booking.getCustomer().getUserId())
                .customerName(booking.getCustomer().getName());

        if (booking.getPartner() != null) {
            builder.partnerId(booking.getPartner().getUserId())
                    .partnerName(booking.getPartner().getName());
        }

        return builder.build();
    }
}
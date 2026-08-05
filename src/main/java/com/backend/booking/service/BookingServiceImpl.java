package com.backend.booking.service;

import java.util.List;
import java.util.stream.Collectors;
import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;
import com.backend.services.entity.Services;
import com.backend.services.repository.ServicesRepository;

import org.springframework.security.access.AccessDeniedException;
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
import com.backend.security.AuthUtils;

@Service
public class BookingServiceImpl implements BookingService {
	private final BookingRepository bookingRepository;
	private final UserRepository userRepository;
	private final ServicesRepository servicesRepository;

	public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository,
	        ServicesRepository servicesRepository) {
	    this.bookingRepository = bookingRepository;
	    this.userRepository = userRepository;
	    this.servicesRepository = servicesRepository;
	}
   
    
    @Override
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {

        // A customer can only ever book on their own behalf - stop anyone from
        // creating a booking under someone else's customerId.
        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(requestDto.getCustomerId())) {
            throw new AccessDeniedException("You can only create bookings for your own account");
        }

        User customer = userRepository.findById(requestDto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with id: " + requestDto.getCustomerId()));

        Services service = servicesRepository.findById(requestDto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with id: " + requestDto.getServiceId()));

        Booking booking = Booking.builder()
                .date(requestDto.getDate())
                .bookingTime(requestDto.getBookingTime())
                .finalAmount(requestDto.getFinalAmount())
                .serviceAddress(requestDto.getServiceAddress())
                .status(BookingStatus.PENDING)
                .customer(customer)
                .service(service)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }

    @Override
    public BookingResponseDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!canAccessBooking(booking)) {
            throw new AccessDeniedException("You do not have access to this booking");
        }

        return convertToResponse(booking);
    }

    @Override
    public List<BookingResponseDto> getAllBookings() {

        // Full booking list is an admin/dispatch view, not something any
        // customer or partner should be able to pull.
        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can list all bookings");
        }

        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByCustomer(Long customerId) {

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(customerId)) {
            throw new AccessDeniedException("You can only view your own bookings");
        }

        return bookingRepository.findByCustomer_UserId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByPartner(Long partnerId) {

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(partnerId)) {
            throw new AccessDeniedException("You can only view your own assigned bookings");
        }

        return bookingRepository.findByPartner_UserId(partnerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDto assignPartner(Long bookingId, Long partnerId) {

        // Also enforced at the route level (SecurityConfig), kept here too so
        // this stays safe even if called from elsewhere in the future.
        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can assign a partner to a booking");
        }

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

        boolean isAssignedPartner = booking.getPartner() != null
                && AuthUtils.isSelf(booking.getPartner().getUserId());
        boolean isOwningCustomer = AuthUtils.isSelf(booking.getCustomer().getUserId());

        // The assigned partner (or an admin) can move a booking through its
        // normal lifecycle. The customer's only allowed action is cancelling.
        boolean allowed = AuthUtils.isAdmin()
                || isAssignedPartner
                || (isOwningCustomer && status == BookingStatus.CANCELLED);

        if (!allowed) {
            throw new AccessDeniedException("You are not allowed to change this booking's status");
        }

        booking.setStatus(status);

        Booking updatedBooking = bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long bookingId) {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can delete a booking");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        bookingRepository.delete(booking);
    }

    private boolean canAccessBooking(Booking booking) {
        if (AuthUtils.isAdmin()) {
            return true;
        }
        if (AuthUtils.isSelf(booking.getCustomer().getUserId())) {
            return true;
        }
        return booking.getPartner() != null && AuthUtils.isSelf(booking.getPartner().getUserId());
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
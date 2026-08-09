package com.backend.booking.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;
import com.backend.services.entity.Services;
import com.backend.services.repository.ServicesRepository;
import com.backend.usersubscription.entity.UserSubscription;
import com.backend.usersubscription.repository.UserSubscriptionRepository;

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
    private final UserSubscriptionRepository userSubscriptionRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ServicesRepository servicesRepository,
            UserSubscriptionRepository userSubscriptionRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.servicesRepository = servicesRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
    }

    @Override
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {

        // ✅ ALWAYS take user from JWT (FINAL FIX)
    	Long loggedInUserId = AuthUtils.currentUserId();

        User customer = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + loggedInUserId));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("Only customers can create bookings");
        }

        Services service = servicesRepository.findById(requestDto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with id: " + requestDto.getServiceId()));

        double originalAmount = service.getBasePrice();
        double finalAmount = originalAmount;

        // ✅ Apply subscription discount (if exists)
        Optional<UserSubscription> subscription =
                userSubscriptionRepository
                        .findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
                                loggedInUserId,
                                "ACTIVE",
                                java.time.LocalDate.now());

        if (subscription.isPresent()) {
            UserSubscription sub = subscription.get();
            double discount = sub.getPlan().getDiscount();
            finalAmount = finalAmount - (finalAmount * discount / 100.0);
        }

        Booking booking = Booking.builder()
                .date(requestDto.getDate())
                .bookingTime(requestDto.getBookingTime())
                .finalAmount(finalAmount)
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
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId));

        if (!canAccessBooking(booking)) {
            throw new AccessDeniedException(
                    "You do not have access to this booking");
        }

        return convertToResponse(booking);
    }

    @Override
    public List<BookingResponseDto> getAllBookings() {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException(
                    "Only an admin can list all bookings");
        }

        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByCustomer(Long customerId) {

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(customerId)) {
            throw new AccessDeniedException(
                    "You can only view your own bookings");
        }

        return bookingRepository.findByCustomer_UserId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDto> getBookingsByPartner(Long partnerId) {

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(partnerId)) {
            throw new AccessDeniedException(
                    "You can only view your own assigned bookings");
        }

        return bookingRepository.findByPartner_UserId(partnerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDto assignPartner(Long bookingId, Long partnerId) {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException(
                    "Only an admin can assign a partner");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found"));

        User partner = userRepository.findById(partnerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Partner not found"));

        if (partner.getRole() != Role.PARTNER) {
            throw new InvalidRequestException(
                    "User is not a PARTNER");
        }

        boolean hasService = partner.getServices() != null && 
                             partner.getServices().stream()
                                    .anyMatch(s -> s.getServiceId().equals(booking.getService().getServiceId()));
        
        if (!hasService) {
            throw new InvalidRequestException("Partner does not provide this service");
        }

        booking.setPartner(partner);

        return convertToResponse(
                bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponseDto updateStatus(
            Long bookingId,
            BookingStatus status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found"));

        boolean isAssignedPartner =
                booking.getPartner() != null &&
                        AuthUtils.isSelf(
                                booking.getPartner().getUserId());

        boolean isCustomer =
                AuthUtils.isSelf(
                        booking.getCustomer().getUserId());

        boolean allowed =
                AuthUtils.isAdmin()
                        || isAssignedPartner
                        || (isCustomer &&
                        status == BookingStatus.CANCELLED);

        if (!allowed) {
            throw new AccessDeniedException(
                    "You cannot update this booking");
        }

        booking.setStatus(status);

        return convertToResponse(
                bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public void deleteBooking(Long bookingId) {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException(
                    "Only admin can delete bookings");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found"));

        bookingRepository.delete(booking);
    }

    private boolean canAccessBooking(Booking booking) {

        if (AuthUtils.isAdmin()) return true;

        if (AuthUtils.isSelf(
                booking.getCustomer().getUserId()))
            return true;

        return booking.getPartner() != null &&
                AuthUtils.isSelf(
                        booking.getPartner().getUserId());
    }

    private BookingResponseDto convertToResponse(
            Booking booking) {

        double originalAmount =
                booking.getService().getBasePrice();

        double discountAmount =
                originalAmount - booking.getFinalAmount();

        BookingResponseDto.BookingResponseDtoBuilder builder =
                BookingResponseDto.builder()
                        .bookingId(booking.getBookingId())
                        .date(booking.getDate())
                        .bookingTime(booking.getBookingTime())
                        .status(booking.getStatus())
                        .finalAmount(booking.getFinalAmount())
                        .originalAmount(originalAmount)
                        .discountAmount(discountAmount)
                        .serviceAddress(booking.getServiceAddress())
                        .customerId(
                                booking.getCustomer().getUserId())
                        .customerName(
                                booking.getCustomer().getName())
                        .serviceId(
                                booking.getService().getServiceId())
                        .serviceName(
                                booking.getService().getSvcName())
                        .paymentStatus(
                                booking.getPayment() != null
                                        ? booking.getPayment().getPaymentStatus()
                                        : null);

        if (booking.getPartner() != null) {
            builder.partnerId(
                            booking.getPartner().getUserId())
                    .partnerName(
                            booking.getPartner().getName());
        }

        return builder.build();
    }
}
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
import com.backend.notification.service.NotificationClient;

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
    private final NotificationClient notificationClient;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ServicesRepository servicesRepository,
            UserSubscriptionRepository userSubscriptionRepository,
            NotificationClient notificationClient) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.servicesRepository = servicesRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.notificationClient = notificationClient;
    }

    @Override
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {
        throw new InvalidRequestException("Bookings must be created through the payment verification flow to ensure payment success.");
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
        Booking savedBooking = bookingRepository.save(booking);

        // Send partner assignment notification asynchronously
        String message = String.format("You've been assigned a new booking for %s on %s.", 
                savedBooking.getService().getSvcName(), savedBooking.getDate());
        notificationClient.sendNotificationAsync(partner.getUserId(), partner.getEmail(), message, "BOOKING_ASSIGNED");

        return convertToResponse(savedBooking);
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

        if (isCustomer && status == BookingStatus.CANCELLED && !AuthUtils.isAdmin()) {
            java.time.LocalDateTime bookingDateTime = java.time.LocalDateTime.of(booking.getDate(), booking.getBookingTime());
            if (java.time.LocalDateTime.now().plusHours(24).isAfter(bookingDateTime)) {
                throw new InvalidRequestException("Cancellations must be made at least 24 hours in advance.");
            }
        }

        if ((status == BookingStatus.CANCELLED || status == BookingStatus.REJECTED) 
                && booking.getStatus() != BookingStatus.CANCELLED 
                && booking.getStatus() != BookingStatus.REJECTED) {
            
            double originalAmount = booking.getService().getBasePrice();
            if (booking.getFinalAmount() < originalAmount) {
                java.util.Optional<UserSubscription> subOpt = userSubscriptionRepository
                        .findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
                                booking.getCustomer().getUserId(), "ACTIVE", java.time.LocalDate.now());
                
                if (subOpt.isEmpty()) {
                    subOpt = userSubscriptionRepository
                            .findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
                                    booking.getCustomer().getUserId(), "EXHAUSTED", java.time.LocalDate.now());
                }

                if (subOpt.isPresent()) {
                    UserSubscription sub = subOpt.get();
                    if (sub.getRemainingUses() < sub.getMaxUses()) {
                        sub.setRemainingUses(sub.getRemainingUses() + 1);
                        if (sub.getRemainingUses() > 0 && "EXHAUSTED".equals(sub.getStatus())) {
                            sub.setStatus("ACTIVE");
                        }
                        userSubscriptionRepository.save(sub);
                    }
                }
            }
            
            // Send cancellation notification
            String message = String.format("Your booking for '%s' on %s at %s has been %s.",
                    booking.getService().getSvcName(), booking.getDate(), booking.getBookingTime(), status.toString().toLowerCase());
            
            java.time.LocalDateTime bookingDateTime = java.time.LocalDateTime.of(booking.getDate(), booking.getBookingTime());
            Double finalAmount = booking.getPayment() != null ? booking.getPayment().getAmount() : booking.getService().getBasePrice();
            
            notificationClient.sendNotificationAsync(booking.getCustomer().getUserId(), 
                    booking.getCustomer().getEmail(), message, "BOOKING_" + status.toString(), finalAmount, booking.getService().getSvcName(), bookingDateTime);
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
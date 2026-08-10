package com.backend.payment.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.booking.entity.Booking;
import com.backend.booking.repository.BookingRepository;
import com.backend.common.enums.BookingStatus;
import com.backend.common.enums.PaymentStatus;
import com.backend.exception.ResourceNotFoundException;
import com.backend.payment.dto.PaymentRequestDto;
import com.backend.payment.dto.PaymentResponseDto;
import com.backend.payment.dto.PaymentVerificationRequestDto;
import com.backend.payment.entity.Payment;
import com.backend.payment.repository.PaymentRepository;
import com.backend.security.AuthUtils;
import com.backend.services.entity.Services;
import com.backend.services.repository.ServicesRepository;
import com.backend.notification.service.NotificationClient;
import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;
import com.backend.usersubscription.entity.UserSubscription;
import com.backend.usersubscription.repository.UserSubscriptionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final String razorpayKeySecret;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final ServicesRepository servicesRepository;
    private final UserRepository userRepository;
    private final NotificationClient notificationClient;
    private final RazorpayClient razorpayClient;
    private final String razorpayKeyId;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            UserSubscriptionRepository userSubscriptionRepository,
            ServicesRepository servicesRepository,
            UserRepository userRepository,
            NotificationClient notificationClient,
            RazorpayClient razorpayClient,
            @Value("${razorpay.key.id}") String razorpayKeyId,
            @Value("${razorpay.key.secret}") String razorpayKeySecret) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.servicesRepository = servicesRepository;
        this.userRepository = userRepository;
        this.notificationClient = notificationClient;
        this.razorpayClient = razorpayClient;
        this.razorpayKeyId = razorpayKeyId != null ? razorpayKeyId.trim() : null;
        this.razorpayKeySecret = razorpayKeySecret != null ? razorpayKeySecret.trim() : null;
    }

    @Override
    @Transactional
    public PaymentResponseDto createPayment(PaymentRequestDto requestDto) {
        
        Long loggedInUserId = AuthUtils.currentUserId();
        
        Services service = servicesRepository.findById(requestDto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        double finalAmount = service.getBasePrice();
        
        Optional<UserSubscription> subscription = userSubscriptionRepository
                .findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
                        loggedInUserId, "ACTIVE", java.time.LocalDate.now());

        if (subscription.isPresent() && subscription.get().getRemainingUses() != null && subscription.get().getRemainingUses() > 0) {
            double discount = subscription.get().getPlan().getDiscount();
            finalAmount = finalAmount - (finalAmount * discount / 100.0);
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (finalAmount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "svc_" + requestDto.getServiceId() + "_" + System.currentTimeMillis());
        Order razorpayOrder;

        try {
            razorpayOrder = razorpayClient.orders.create(orderRequest);
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order", e);
        }
        
        String razorpayOrderId = razorpayOrder.get("id").toString();
       
        return PaymentResponseDto.builder()
                .amount(finalAmount)
                .paymentMethod(requestDto.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .razorpayOrderId(razorpayOrderId)
                .build();
    }

    @Override
    @Transactional
    public PaymentResponseDto verifyPayment(PaymentVerificationRequestDto requestDto) {

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", requestDto.getRazorpayOrderId());
            options.put("razorpay_payment_id", requestDto.getRazorpayPaymentId());
            options.put("razorpay_signature", requestDto.getRazorpaySignature());

            boolean isValid = com.razorpay.Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!isValid) {
                throw new RuntimeException("Invalid payment signature");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verifying signature", e);
        }

        Long loggedInUserId = AuthUtils.currentUserId();
        User customer = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Services service = servicesRepository.findById(requestDto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
                
        double finalAmount = service.getBasePrice();
        
        Optional<UserSubscription> subscriptionOpt = userSubscriptionRepository
                .findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
                        loggedInUserId, "ACTIVE", java.time.LocalDate.now());

        if (subscriptionOpt.isPresent() && subscriptionOpt.get().getRemainingUses() != null && subscriptionOpt.get().getRemainingUses() > 0) {
            UserSubscription subscription = subscriptionOpt.get();
            double discount = subscription.getPlan().getDiscount();
            finalAmount = finalAmount - (finalAmount * discount / 100.0);
            
            // Decrement subscription usage
            subscription.setRemainingUses(subscription.getRemainingUses() - 1);
            if (subscription.getRemainingUses() <= 0) {
                subscription.setStatus("EXHAUSTED");
            }
            userSubscriptionRepository.save(subscription);
        }
        
        // Save booking ONLY after successful payment
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
        
        Payment payment = Payment.builder()
                .amount(finalAmount)
                .paymentMethod(requestDto.getPaymentMethod())
                .paymentStatus(PaymentStatus.SUCCESS)
                .razorpayOrderId(requestDto.getRazorpayOrderId())
                .razorpayPaymentId(requestDto.getRazorpayPaymentId())
                .booking(savedBooking)
                .build();
                
        Payment savedPayment = paymentRepository.save(payment);
        
        // Send notification asynchronously
        String message = String.format("Your payment of ₹%.2f was successful! Your booking for '%s' is confirmed for %s at %s.", 
                finalAmount, service.getSvcName(), requestDto.getDate(), requestDto.getBookingTime());
        java.time.LocalDateTime bookingDateTime = java.time.LocalDateTime.of(requestDto.getDate(), requestDto.getBookingTime());
        notificationClient.sendNotificationAsync(customer.getUserId(), customer.getEmail(), message, "BOOKING_CONFIRMED", finalAmount, service.getSvcName(), bookingDateTime);
        
        return convertToResponse(savedPayment);
    }

    @Override
    public PaymentResponseDto getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        if (!canAccessPayment(payment)) {
            throw new AccessDeniedException("You do not have access to this payment");
        }

        return convertToResponse(payment);
    }

    @Override
    public PaymentResponseDto getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking id: " + bookingId));

        if (!canAccessPayment(payment)) {
            throw new AccessDeniedException("You do not have access to this payment");
        }

        return convertToResponse(payment);
    }

    @Override
    public List<PaymentResponseDto> getAllPayments() {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can list all payments");
        }

        return paymentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponseDto updateStatus(Long paymentId, PaymentStatus status) {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can update a payment's status");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        payment.setPaymentStatus(status);

        Payment updatedPayment = paymentRepository.save(payment);

        return convertToResponse(updatedPayment);
    }

    @Override
    @Transactional
    public void deletePayment(Long paymentId) {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can delete a payment");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        paymentRepository.delete(payment);
    }

    private boolean canAccessPayment(Payment payment) {
        if (AuthUtils.isAdmin()) {
            return true;
        }
        Booking booking = payment.getBooking();
        if (AuthUtils.isSelf(booking.getCustomer().getUserId())) {
            return true;
        }
        return booking.getPartner() != null && AuthUtils.isSelf(booking.getPartner().getUserId());
    }

    @Override
    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    private PaymentResponseDto convertToResponse(Payment payment) {
        return PaymentResponseDto.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .bookingId(payment.getBooking().getBookingId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .build();
    }
}
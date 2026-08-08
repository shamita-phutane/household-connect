package com.backend.payment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.booking.entity.Booking;
import com.backend.booking.repository.BookingRepository;
import com.backend.common.enums.PaymentStatus;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.payment.dto.PaymentRequestDto;
import com.backend.payment.dto.PaymentResponseDto;
import com.backend.payment.dto.PaymentVerificationRequestDto;
import com.backend.payment.entity.Payment;
import com.backend.payment.repository.PaymentRepository;
import com.backend.security.AuthUtils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final String razorpayKeySecret;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final RazorpayClient razorpayClient;
    private final String razorpayKeyId;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            RazorpayClient razorpayClient,
            @Value("${razorpay.key.id}") String razorpayKeyId,
            @Value("${razorpay.key.secret}") String razorpayKeySecret) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.razorpayClient = razorpayClient;
        this.razorpayKeyId = razorpayKeyId != null ? razorpayKeyId.trim() : null;
        this.razorpayKeySecret = razorpayKeySecret != null ? razorpayKeySecret.trim() : null;

        System.out.println("KEY_ID = " + this.razorpayKeyId);
        System.out.println("KEY_SECRET = " + this.razorpayKeySecret);
    }
    @Override
    @Transactional
    public PaymentResponseDto createPayment(PaymentRequestDto requestDto) {

        Booking booking = bookingRepository.findById(requestDto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + requestDto.getBookingId()));

        // Only the customer who owns this booking can pay for it.
        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(booking.getCustomer().getUserId())) {
            throw new AccessDeniedException("You can only pay for your own bookings");
        }

        if (paymentRepository.existsByBooking_BookingId(requestDto.getBookingId())) {
            throw new DuplicateResourceException(
                    "Payment already exists for booking id: " + requestDto.getBookingId());
        }
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", booking.getFinalAmount().intValue() * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + booking.getBookingId());
        Order razorpayOrder;

        try {
            razorpayOrder = razorpayClient.orders.create(orderRequest);
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order", e);
        }
        String razorpayOrderId = razorpayOrder.get("id").toString();
       
        Payment payment = Payment.builder()
                .amount(booking.getFinalAmount())
                .paymentMethod(requestDto.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .razorpayOrderId(razorpayOrderId)
                .booking(booking)
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        return convertToResponse(savedPayment);
        
    }
    @Override
    @Transactional
    public PaymentResponseDto verifyPayment(
            PaymentVerificationRequestDto requestDto) {

        Payment payment = paymentRepository
                .findByRazorpayOrderId(requestDto.getRazorpayOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found"));

        // ✅ Signature verification
        String generatedSignature = generateSignature(
                requestDto.getRazorpayOrderId(),
                requestDto.getRazorpayPaymentId()
        );

        if (!generatedSignature.equals(requestDto.getRazorpaySignature())) {

            payment.setPaymentStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            throw new RuntimeException("Invalid payment signature");
        }

        payment.setRazorpayPaymentId(requestDto.getRazorpayPaymentId());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);

        return convertToResponse(paymentRepository.save(payment));
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

        // Payment status changes are effectively financial reconciliation
        // (matching a Razorpay callback/webhook outcome) - admin/system only,
        // never something a customer or partner should be able to trigger
        // directly.
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
    private String generateSignature(String orderId, String paymentId) {
        try {
            String payload = orderId + "|" + paymentId;

            javax.crypto.Mac sha256_HMAC = javax.crypto.Mac.getInstance("HmacSHA256");

            javax.crypto.spec.SecretKeySpec secret_key =
                    new javax.crypto.spec.SecretKeySpec(
                            razorpayKeySecret.getBytes(),
                            "HmacSHA256"
                    );

            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(payload.getBytes());

            return org.apache.commons.codec.binary.Hex.encodeHexString(hash);

        } catch (Exception e) {
            throw new RuntimeException("Signature generation failed", e);
        }
    }
}
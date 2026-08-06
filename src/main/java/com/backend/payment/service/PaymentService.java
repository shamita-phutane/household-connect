package com.backend.payment.service;

import java.util.List;

import com.backend.common.enums.PaymentStatus;
import com.backend.payment.dto.PaymentRequestDto;
import com.backend.payment.dto.PaymentResponseDto;
import com.backend.payment.dto.PaymentVerificationRequestDto;

public interface PaymentService {

    // Create Razorpay order
    PaymentResponseDto createPayment(PaymentRequestDto requestDto);

    // Verify successful Razorpay payment
    PaymentResponseDto verifyPayment(PaymentVerificationRequestDto requestDto);

    // Get payment by ID
    PaymentResponseDto getPaymentById(Long paymentId);

    // Get payment for a booking
    PaymentResponseDto getPaymentByBooking(Long bookingId);

    // Admin
    List<PaymentResponseDto> getAllPayments();

    // Admin
    PaymentResponseDto updateStatus(Long paymentId, PaymentStatus status);

    // Admin
    void deletePayment(Long paymentId);

}
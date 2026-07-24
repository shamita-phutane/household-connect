package com.backend.payment.service;

import java.util.List;

import com.backend.common.enums.PaymentStatus;
import com.backend.payment.dto.PaymentRequestDto;
import com.backend.payment.dto.PaymentResponseDto;

public interface PaymentService {

    // Create a payment for a booking (status defaults to PENDING)
    PaymentResponseDto createPayment(PaymentRequestDto requestDto);

    // Get payment by ID
    PaymentResponseDto getPaymentById(Long paymentId);

    // Get payment for a specific booking
    PaymentResponseDto getPaymentByBooking(Long bookingId);

    // Get all payments
    List<PaymentResponseDto> getAllPayments();

    // Update payment status (e.g. SUCCESS, FAILED, REFUNDED)
    PaymentResponseDto updateStatus(Long paymentId, PaymentStatus status);

    // Delete a payment
    void deletePayment(Long paymentId);
}
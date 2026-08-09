package com.backend.payment.service;

import java.util.List;

import com.backend.common.enums.PaymentStatus;
import com.backend.payment.dto.PaymentRequestDto;
import com.backend.payment.dto.PaymentResponseDto;
import com.backend.payment.dto.PaymentVerificationRequestDto;


public interface PaymentService {
	
    PaymentResponseDto createPayment(PaymentRequestDto requestDto);
    PaymentResponseDto verifyPayment(PaymentVerificationRequestDto requestDto);
    PaymentResponseDto getPaymentById(Long paymentId);
    PaymentResponseDto getPaymentByBooking(Long bookingId);
    List<PaymentResponseDto> getAllPayments();
    PaymentResponseDto updateStatus(Long paymentId, PaymentStatus status);
    void deletePayment(Long paymentId);
    String getRazorpayKeyId();

}
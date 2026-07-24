package com.backend.payment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.booking.entity.Booking;
import com.backend.booking.repository.BookingRepository;
import com.backend.common.enums.PaymentStatus;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.payment.dto.PaymentRequestDto;
import com.backend.payment.dto.PaymentResponseDto;
import com.backend.payment.entity.Payment;
import com.backend.payment.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public PaymentResponseDto createPayment(PaymentRequestDto requestDto) {

        Booking booking = bookingRepository.findById(requestDto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + requestDto.getBookingId()));

        if (paymentRepository.existsByBooking_BookingId(requestDto.getBookingId())) {
            throw new DuplicateResourceException(
                    "Payment already exists for booking id: " + requestDto.getBookingId());
        }

        Payment payment = Payment.builder()
                .amount(requestDto.getAmount())
                .paymentMethod(requestDto.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .booking(booking)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        return convertToResponse(savedPayment);
    }

    @Override
    public PaymentResponseDto getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return convertToResponse(payment);
    }

    @Override
    public PaymentResponseDto getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking id: " + bookingId));
        return convertToResponse(payment);
    }

    @Override
    public List<PaymentResponseDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponseDto updateStatus(Long paymentId, PaymentStatus status) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        payment.setPaymentStatus(status);

        Payment updatedPayment = paymentRepository.save(payment);

        return convertToResponse(updatedPayment);
    }

    @Override
    @Transactional
    public void deletePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        paymentRepository.delete(payment);
    }

    private PaymentResponseDto convertToResponse(Payment payment) {
        return PaymentResponseDto.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .bookingId(payment.getBooking().getBookingId())
                .build();
    }
}
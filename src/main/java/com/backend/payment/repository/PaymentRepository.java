package com.backend.payment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBooking_BookingId(Long bookingId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    boolean existsByBooking_BookingId(Long bookingId);
}


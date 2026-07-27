package com.backend.booking.entity;
import com.backend.services.entity.Services;
import java.time.LocalDate;
import java.time.LocalTime;
import com.backend.user.entity.User;
import com.backend.review.entity.Review;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.backend.payment.entity.Payment;

import com.backend.common.enums.BookingStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    @Column(nullable = false)
    private LocalDate date;

    @NotNull(message = "Booking time is required")
    @Column(nullable = false)
    private LocalTime bookingTime;

    @NotNull(message = "Booking status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @NotNull(message = "Final amount is required")
    @Positive(message = "Final amount must be greater than zero")
    @Column(name = "final_amount", nullable = false)
    private Double finalAmount;

    @NotBlank(message = "Service address is required")
    @Column(nullable = false, length = 255)
    private String serviceAddress;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    private User partner;
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;
    
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Review review;
}

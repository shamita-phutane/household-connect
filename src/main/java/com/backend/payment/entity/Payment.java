package com.backend.payment.entity;

import com.backend.booking.entity.Booking;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import com.backend.common.enums.PaymentMethod;
import com.backend.common.enums.PaymentStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column
    private PaymentMethod paymentMethod;

    @NotNull(message = "Payment status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;
    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

}

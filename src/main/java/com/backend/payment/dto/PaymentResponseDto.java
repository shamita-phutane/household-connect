package com.backend.payment.dto;

import com.backend.common.enums.PaymentMethod;
import com.backend.common.enums.PaymentStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDto {

    private Long paymentId;
    private Double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private Long bookingId;
    private String razorpayOrderId;
}
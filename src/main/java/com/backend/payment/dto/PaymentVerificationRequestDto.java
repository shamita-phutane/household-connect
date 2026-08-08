package com.backend.payment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerificationRequestDto {

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
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
    
    // Booking Details
    private Long serviceId;
    private java.time.LocalDate date;
    private java.time.LocalTime bookingTime;
    private String serviceAddress;
    private com.backend.common.enums.PaymentMethod paymentMethod;
}
package com.backend.payment.dto;

import com.backend.common.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDto {

    @NotNull(message = "Service id is required")
    private Long serviceId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}

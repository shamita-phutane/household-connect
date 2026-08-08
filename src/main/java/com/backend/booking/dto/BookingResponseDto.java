package com.backend.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.backend.common.enums.BookingStatus;
import com.backend.common.enums.PaymentStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDto {

    private Long bookingId;

    private LocalDate date;

    private LocalTime bookingTime;

    private BookingStatus status;

    private Double finalAmount;

    private Double originalAmount;

    private Double discountAmount;

    private String serviceAddress;

    private Long customerId;

    private String customerName;

    private Long partnerId;

    private String partnerName;

    private Long serviceId;

    private String serviceName;

    // Null when no payment has been started for this booking yet.
    // BookingStatus alone can't tell a customer whether they still owe
    // payment (booking just created, no Payment row) or paid and are
    // simply waiting on a partner - both look like status=PENDING.
    private PaymentStatus paymentStatus;

}
package com.backend.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.backend.common.enums.BookingStatus;

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
    private String serviceAddress;

    private Long customerId;
    private String customerName;

    private Long partnerId;
    private String partnerName;
}
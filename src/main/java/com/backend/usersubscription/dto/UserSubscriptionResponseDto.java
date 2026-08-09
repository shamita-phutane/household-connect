package com.backend.usersubscription.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSubscriptionResponseDto {

    private Long subId;
    private Long userId;
    private String userName;
    private Long planId;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String razorpayOrderId;
    private Double price;
    private Double discount;
    private String description;
    private Integer remainingUses;
    private Integer maxUses;
}
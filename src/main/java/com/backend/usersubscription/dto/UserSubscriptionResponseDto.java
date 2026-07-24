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
}
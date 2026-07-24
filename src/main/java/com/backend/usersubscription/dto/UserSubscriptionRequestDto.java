package com.backend.usersubscription.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@NoArgsConstructor
@Getter
@Setter
public class UserSubscriptionRequestDto {

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Plan id is required")
    private Long planId;
}
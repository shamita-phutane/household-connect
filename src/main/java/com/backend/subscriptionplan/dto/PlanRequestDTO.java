package com.backend.subscriptionplan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanRequestDTO {

    @NotBlank(message = "Plan name is required")
    private String planName;

    @NotNull(message = "Discount is required")
    @PositiveOrZero(message = "Discount cannot be negative")
    private Double discount;
}
package com.backend.subscriptionplan.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanResponseDTO {

    private Long planId;
    private String planName;
    private Double discount;
}
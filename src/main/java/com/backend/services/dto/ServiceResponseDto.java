package com.backend.services.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceResponseDto {

    private Long serviceId;
    private String svcName;
    private String category;
    private Double basePrice;
}
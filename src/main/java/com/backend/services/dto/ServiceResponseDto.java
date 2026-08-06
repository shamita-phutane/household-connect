package com.backend.services.dto;

import com.backend.common.enums.ServiceCategory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceResponseDto {

    private Long serviceId;

    private String svcName;

    private ServiceCategory category;

    private Double basePrice;

    private String description;
    
    private String imageUrl;

}
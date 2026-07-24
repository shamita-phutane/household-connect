package com.backend.services.service;

import java.util.List;

import com.backend.services.dto.ServiceRequestDto;
import com.backend.services.dto.ServiceResponseDto;

public interface ServicesService {

    ServiceResponseDto createService(ServiceRequestDto requestDto);

    List<ServiceResponseDto> getAllServices();

    ServiceResponseDto getServiceById(Long serviceId);

    ServiceResponseDto updateService(Long serviceId, ServiceRequestDto requestDto);

    void deleteService(Long serviceId);
}
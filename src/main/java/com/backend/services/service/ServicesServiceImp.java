package com.backend.services.service;


import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.services.dto.ServiceRequestDto;
import com.backend.services.dto.ServiceResponseDto;
import com.backend.services.repository.ServicesRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicesServiceImp implements ServicesService {

    private final ServicesRepository serviceRepository;
    private final ModelMapper modelMapper;

    @Override
    public ServiceResponseDto createService(ServiceRequestDto requestDto) {
        com.backend.services.entity.Services entity =
                modelMapper.map(requestDto, com.backend.services.entity.Services.class);
        com.backend.services.entity.Services saved = serviceRepository.save(entity);
        return modelMapper.map(saved, ServiceResponseDto.class);
    }

    @Override
    public List<ServiceResponseDto> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, ServiceResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ServiceResponseDto getServiceById(Long serviceId) {
        com.backend.services.entity.Services entity = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service not found with id: " + serviceId));
        return modelMapper.map(entity, ServiceResponseDto.class);
    }

    @Override
    public ServiceResponseDto updateService(Long serviceId, ServiceRequestDto requestDto) {
        com.backend.services.entity.Services entity = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service not found with id: " + serviceId));

        entity.setSvcName(requestDto.getSvcName());
        entity.setCategory(requestDto.getCategory());
        entity.setBasePrice(requestDto.getBasePrice());

        com.backend.services.entity.Services updated = serviceRepository.save(entity);
        return modelMapper.map(updated, ServiceResponseDto.class);
    }

    @Override
    public void deleteService(Long serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new EntityNotFoundException("Service not found with id: " + serviceId);
        }
        serviceRepository.deleteById(serviceId);
    }
}
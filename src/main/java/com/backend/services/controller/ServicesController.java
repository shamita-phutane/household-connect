package com.backend.services.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.services.dto.ServiceRequestDto;
import com.backend.services.dto.ServiceResponseDto;
import com.backend.services.service.ServicesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServicesController {

    private final ServicesService servicesService;

    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@Valid @RequestBody ServiceRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicesService.createService(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponseDto>> getAllServices() {
        return ResponseEntity.ok(servicesService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponseDto> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(servicesService.getServiceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponseDto> updateService(@PathVariable Long id, @Valid @RequestBody ServiceRequestDto requestDto) {
        return ResponseEntity.ok(servicesService.updateService(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        servicesService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
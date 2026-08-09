package com.backend.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.backend.user.dto.UserResponseDto;
import com.backend.user.service.UserService;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    private final UserService userService;

    public PartnerController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    @GetMapping("/by-service/{serviceId}")
    public ResponseEntity<List<UserResponseDto>> getPartnersByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(userService.getPartnersByService(serviceId));
    }
}

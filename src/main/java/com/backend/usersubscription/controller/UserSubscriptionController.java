package com.backend.usersubscription.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.usersubscription.dto.UserSubscriptionRequestDto;
import com.backend.usersubscription.dto.UserSubscriptionResponseDto;
import com.backend.usersubscription.service.UserSubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user-subscriptions")
@RequiredArgsConstructor
public class UserSubscriptionController {

    private final UserSubscriptionService userSubscriptionService;

    @PostMapping
    public ResponseEntity<UserSubscriptionResponseDto> purchase(@Valid @RequestBody UserSubscriptionRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userSubscriptionService.purchaseSubscription(requestDto));
    }

    @PostMapping("/verify")
    public ResponseEntity<UserSubscriptionResponseDto> verifyPayment(@Valid @RequestBody com.backend.payment.dto.PaymentVerificationRequestDto requestDto) {
        return ResponseEntity.ok(userSubscriptionService.verifySubscriptionPayment(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<UserSubscriptionResponseDto>> getAll() {
        return ResponseEntity.ok(userSubscriptionService.getAllSubscriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSubscriptionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userSubscriptionService.getSubscriptionById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSubscriptionResponseDto>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userSubscriptionService.getSubscriptionsByUserId(userId));
    }
}
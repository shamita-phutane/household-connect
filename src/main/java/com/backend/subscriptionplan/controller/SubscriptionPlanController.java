package com.backend.subscriptionplan.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.subscriptionplan.dto.PlanRequestDTO;
import com.backend.subscriptionplan.dto.PlanResponseDTO;
import com.backend.subscriptionplan.service.SubscriptionPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @PostMapping
    public ResponseEntity<PlanResponseDTO> createPlan(@Valid @RequestBody PlanRequestDTO requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionPlanService.createPlan(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<PlanResponseDTO>> getAllPlans() {
        return ResponseEntity.ok(subscriptionPlanService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanResponseDTO> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanResponseDTO> updatePlan(@PathVariable Long id, @Valid @RequestBody PlanRequestDTO requestDto) {
        return ResponseEntity.ok(subscriptionPlanService.updatePlan(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        subscriptionPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
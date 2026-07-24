package com.backend.subscriptionplan.service;

import java.util.List;

import com.backend.subscriptionplan.dto.PlanRequestDTO;
import com.backend.subscriptionplan.dto.PlanResponseDTO;

public interface SubscriptionPlanService {

	PlanResponseDTO createPlan(PlanRequestDTO requestDto);

    List<PlanResponseDTO> getAllPlans();

    PlanResponseDTO getPlanById(Long planId);

    PlanResponseDTO updatePlan(Long planId, PlanRequestDTO requestDto);

    void deletePlan(Long planId);
}
package com.backend.subscriptionplan.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.exception.ResourceNotFoundException;
import com.backend.subscriptionplan.dto.PlanRequestDTO;
import com.backend.subscriptionplan.dto.PlanResponseDTO;
import com.backend.subscriptionplan.entity.SubscriptionPlan;
import com.backend.subscriptionplan.repository.SubscriptionPlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final ModelMapper modelMapper;

    @Override
    public PlanResponseDTO createPlan(PlanRequestDTO requestDto) {
        SubscriptionPlan entity = modelMapper.map(requestDto, SubscriptionPlan.class);
        SubscriptionPlan saved = subscriptionPlanRepository.save(entity);
        return modelMapper.map(saved, PlanResponseDTO.class);
    }

    @Override
    public List<PlanResponseDTO> getAllPlans() {
        return subscriptionPlanRepository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, PlanResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public PlanResponseDTO getPlanById(Long planId) {
        SubscriptionPlan entity = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + planId));
        return modelMapper.map(entity, PlanResponseDTO.class);
    }

    @Override
    public PlanResponseDTO updatePlan(Long planId, PlanRequestDTO requestDto) {
        SubscriptionPlan entity = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + planId));

        entity.setPlanName(requestDto.getPlanName());
        entity.setDiscount(requestDto.getDiscount());

        SubscriptionPlan updated = subscriptionPlanRepository.save(entity);
        return modelMapper.map(updated, PlanResponseDTO.class);
    }

    @Override
    public void deletePlan(Long planId) {
        if (!subscriptionPlanRepository.existsById(planId)) {
            throw new ResourceNotFoundException("Subscription plan not found with id: " + planId);
        }
        subscriptionPlanRepository.deleteById(planId);
    }
}

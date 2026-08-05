package com.backend.usersubscription.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.exception.ResourceNotFoundException;
import com.backend.security.AuthUtils;
import com.backend.subscriptionplan.entity.SubscriptionPlan;
import com.backend.subscriptionplan.repository.SubscriptionPlanRepository;
import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;
import com.backend.usersubscription.dto.UserSubscriptionRequestDto;
import com.backend.usersubscription.dto.UserSubscriptionResponseDto;
import com.backend.usersubscription.entity.UserSubscription;
import com.backend.usersubscription.repository.UserSubscriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public UserSubscriptionResponseDto purchaseSubscription(UserSubscriptionRequestDto requestDto) {

        // A user can only buy a subscription for themselves.
        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(requestDto.getUserId())) {
            throw new AccessDeniedException("You can only purchase a subscription for your own account");
        }

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDto.getUserId()));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(requestDto.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + requestDto.getPlanId()));

        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusMonths(1));
        subscription.setStatus("ACTIVE");

        UserSubscription saved = userSubscriptionRepository.save(subscription);
        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSubscriptionResponseDto> getAllSubscriptions() {

        if (!AuthUtils.isAdmin()) {
            throw new AccessDeniedException("Only an admin can list all subscriptions");
        }

        return userSubscriptionRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserSubscriptionResponseDto getSubscriptionById(Long subId) {
        UserSubscription subscription = userSubscriptionRepository.findById(subId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + subId));

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(subscription.getUser().getUserId())) {
            throw new AccessDeniedException("You do not have access to this subscription");
        }

        return mapToResponseDto(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSubscriptionResponseDto> getSubscriptionsByUserId(Long userId) {

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(userId)) {
            throw new AccessDeniedException("You can only view your own subscriptions");
        }

        return userSubscriptionRepository.findAll()
                .stream()
                .filter(s -> s.getUser().getUserId().equals(userId))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private UserSubscriptionResponseDto mapToResponseDto(UserSubscription subscription) {
        UserSubscriptionResponseDto dto = new UserSubscriptionResponseDto();
        dto.setSubId(subscription.getSubId());
        dto.setUserId(subscription.getUser().getUserId());
        dto.setUserName(subscription.getUser().getName());
        dto.setPlanId(subscription.getPlan().getPlanId());
        dto.setPlanName(subscription.getPlan().getPlanName());
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setStatus(subscription.getStatus());
        return dto;
    }}
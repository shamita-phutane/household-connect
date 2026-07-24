package com.backend.usersubscription.service;

import java.util.List;

import com.backend.usersubscription.dto.UserSubscriptionRequestDto;
import com.backend.usersubscription.dto.UserSubscriptionResponseDto;

public interface UserSubscriptionService {

    UserSubscriptionResponseDto purchaseSubscription(UserSubscriptionRequestDto requestDto);

    List<UserSubscriptionResponseDto> getAllSubscriptions();

    UserSubscriptionResponseDto getSubscriptionById(Long subId);

    List<UserSubscriptionResponseDto> getSubscriptionsByUserId(Long userId);
}
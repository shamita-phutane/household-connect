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
import com.backend.payment.dto.PaymentVerificationRequestDto;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;

@Service
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final RazorpayClient razorpayClient;
    private final String razorpayKeySecret;

    public UserSubscriptionServiceImpl(
            UserSubscriptionRepository userSubscriptionRepository,
            UserRepository userRepository,
            SubscriptionPlanRepository subscriptionPlanRepository,
            RazorpayClient razorpayClient,
            @Value("${razorpay.key.secret}") String razorpayKeySecret) {
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.userRepository = userRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.razorpayClient = razorpayClient;
        this.razorpayKeySecret = razorpayKeySecret;
    }

    @Override
    public UserSubscriptionResponseDto purchaseSubscription(UserSubscriptionRequestDto requestDto) {

        // A user can only buy a subscription for themselves.
        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(requestDto.getUserId())) {
            throw new AccessDeniedException("You can only purchase a subscription for your own account");
        }

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDto.getUserId()));

        java.util.Optional<UserSubscription> existing = userSubscriptionRepository
                .findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
                        requestDto.getUserId(), "ACTIVE", java.time.LocalDate.now());
        if (existing.isPresent()) {
            throw new com.backend.exception.InvalidRequestException("You already have an active subscription");
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById(requestDto.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + requestDto.getPlanId()));

        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusMonths(1));
        subscription.setStatus("PENDING");
        
        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (plan.getPrice() * 100)); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "sub_" + System.currentTimeMillis());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            subscription.setRazorpayOrderId(razorpayOrder.get("id"));

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order for subscription", e);
        }

        UserSubscription saved = userSubscriptionRepository.save(subscription);
        return mapToResponseDto(saved);
    }

    @Override
    @Transactional
    public UserSubscriptionResponseDto verifySubscriptionPayment(PaymentVerificationRequestDto requestDto) {
        
    	try {
    	    JSONObject options = new JSONObject();
    	    options.put("razorpay_order_id", requestDto.getRazorpayOrderId());
    	    options.put("razorpay_payment_id", requestDto.getRazorpayPaymentId());
    	    options.put("razorpay_signature", requestDto.getRazorpaySignature());

    	    boolean isValid = com.razorpay.Utils.verifyPaymentSignature(options, razorpayKeySecret);

    	    if (!isValid) {
    	        throw new com.backend.exception.InvalidRequestException("Payment signature verification failed");
    	    }

    	} catch (Exception e) {
    	    throw new RuntimeException("Error verifying payment", e);
    	}

        UserSubscription subscription = userSubscriptionRepository.findByRazorpayOrderId(requestDto.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found for order id: " + requestDto.getRazorpayOrderId()));

        subscription.setRazorpayPaymentId(requestDto.getRazorpayPaymentId());
        subscription.setStatus("ACTIVE");
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusMonths(1));
        
        int max = 0;
        if (subscription.getPlan().getPlanName().equalsIgnoreCase("Basic")) max = 2;
        else if (subscription.getPlan().getPlanName().equalsIgnoreCase("Pro")) max = 5;
        else if (subscription.getPlan().getPlanName().equalsIgnoreCase("Elite")) max = 9999;
        
        subscription.setMaxUses(max);
        subscription.setRemainingUses(max);

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

        return userSubscriptionRepository.findByUser_UserId(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserSubscriptionResponseDto cancelSubscription(Long subId) {
        UserSubscription subscription = userSubscriptionRepository.findById(subId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + subId));

        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(subscription.getUser().getUserId())) {
            throw new AccessDeniedException("You can only cancel your own subscription");
        }

        subscription.setStatus("CANCELLED");
        subscription.setRemainingUses(0);

        UserSubscription saved = userSubscriptionRepository.save(subscription);
        return mapToResponseDto(saved);
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
        dto.setRazorpayOrderId(subscription.getRazorpayOrderId());
        dto.setPrice(subscription.getPlan().getPrice());
        dto.setDiscount(subscription.getPlan().getDiscount());
        dto.setDescription(subscription.getPlan().getDescription());
        dto.setRemainingUses(subscription.getRemainingUses());
        dto.setMaxUses(subscription.getMaxUses());
        return dto;
    }}
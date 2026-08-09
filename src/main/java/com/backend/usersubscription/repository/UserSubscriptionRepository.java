package com.backend.usersubscription.repository;

import java.time.LocalDate;
import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.usersubscription.entity.UserSubscription;


@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    List<UserSubscription> findByUser_UserId(Long userId);

    Optional<UserSubscription> findFirstByUser_UserIdAndStatusAndEndDateGreaterThanEqual(
            Long userId,
            String status,
            LocalDate date
    );

    Optional<UserSubscription> findByRazorpayOrderId(String razorpayOrderId);
}
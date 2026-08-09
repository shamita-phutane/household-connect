package com.backend.usersubscription.entity;

import java.time.LocalDate;

import com.backend.subscriptionplan.entity.SubscriptionPlan;
import com.backend.user.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String status;

    @Column(nullable = true)
    private String razorpayOrderId;

    @Column(nullable = true)
    private String razorpayPaymentId;
}
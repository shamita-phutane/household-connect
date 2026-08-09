package com.backend.config;

import com.backend.subscriptionplan.entity.SubscriptionPlan;
import com.backend.subscriptionplan.repository.SubscriptionPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initSubscriptionPlans(SubscriptionPlanRepository repository, JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE bookings DROP COLUMN is_priority");
            } catch (Exception e) {}

            try {
                jdbcTemplate.execute("ALTER TABLE subscription_plans DROP COLUMN max_uses");
                jdbcTemplate.execute("ALTER TABLE subscription_plans DROP COLUMN priority_booking");
                jdbcTemplate.execute("ALTER TABLE subscription_plans DROP COLUMN free_cancellation");
            } catch (Exception e) {}
            
            try {
                jdbcTemplate.execute("ALTER TABLE bookings MODIFY COLUMN status ENUM('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'REJECTED') NOT NULL");
            } catch (Exception e) {}
            
            if(repository.count() < 3) {
                repository.deleteAll();
                
                SubscriptionPlan basic = new SubscriptionPlan();
                basic.setPlanName("Basic");
                basic.setPrice(299.0);
                basic.setDiscount(5.0);
                basic.setDescription("5% discount,Faster booking confirmation,Email support");

                SubscriptionPlan pro = new SubscriptionPlan();
                pro.setPlanName("Pro");
                pro.setPrice(599.0);
                pro.setDiscount(10.0);
                pro.setDescription("10% discount,Free cancellation within 24 hours,Priority customer support,Faster partner assignment");

                SubscriptionPlan elite = new SubscriptionPlan();
                elite.setPlanName("Elite");
                elite.setPrice(999.0);
                elite.setDiscount(15.0);
                elite.setDescription("15% discount,Free cancellation anytime before service,Instant booking confirmation,Dedicated support,Exclusive peak-time availability");

                repository.saveAll(List.of(basic, pro, elite));
            }
        };
    }
}

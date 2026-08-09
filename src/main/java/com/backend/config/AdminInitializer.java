package com.backend.config;

import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;
import com.backend.common.enums.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            String adminEmail = "admin@test.com";

            if (userRepository.findByEmail(adminEmail).isPresent()) {
                System.out.println("Admin already exists.");
                return;
            }

            User admin = User.builder()
                    .name("Admin User")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("password123"))
                    .phone("9999999999")
                    .city("Mumbai")
                    .role(Role.ADMIN)
                    .verified(true)
                    .build();

            userRepository.save(admin);

            System.out.println("Admin user created successfully!");
        };
    }
}
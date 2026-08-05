package com.backend.config;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.backend.security.CustomUserDetailsService;
import com.backend.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    // Returns a clean JSON body instead of Spring's default empty-body response
    // when an unauthenticated request hits a protected endpoint (no/invalid token).
    @Bean
    public org.springframework.security.web.AuthenticationEntryPoint authenticationEntryPoint() {
        ObjectMapper mapper = new ObjectMapper();
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            Map<String, Object> body = new HashMap<>();
            body.put("timestamp", LocalDateTime.now().toString());
            body.put("status", HttpStatus.UNAUTHORIZED.value());
            body.put("message", "Authentication required. Please log in.");
            response.getWriter().write(mapper.writeValueAsString(body));
        };
    }

    // Returns a clean JSON body when an authenticated user's role doesn't have
    // access to the endpoint (e.g. a CUSTOMER token hitting an ADMIN-only route).
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        ObjectMapper mapper = new ObjectMapper();
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            Map<String, Object> body = new HashMap<>();
            body.put("timestamp", LocalDateTime.now().toString());
            body.put("status", HttpStatus.FORBIDDEN.value());
            body.put("message", "You do not have permission to access this resource.");
            response.getWriter().write(mapper.writeValueAsString(body));
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/actuator/**"
                        ).permitAll()

                        // Signup has to be reachable without a token
                        .requestMatchers(HttpMethod.POST, "/api/users")
                        .permitAll()

                        // Public catalog browsing - visitors can see services/plans
                        // before creating an account
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/services/**",
                                "/api/subscription-plans/**"
                        ).permitAll()

                        // Only admins manage the catalog (create/update/delete)
                        .requestMatchers(
                                "/api/services/**",
                                "/api/subscription-plans/**"
                        ).hasRole("ADMIN")

                        // Only admins dispatch/remove bookings
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/assign-partner/*")
                        .hasRole("ADMIN")

                        // Customers, partners and admins all need the rest of the
                        // booking endpoints (creating, viewing, updating status).
                        // Per-record ownership (e.g. a customer only seeing their
                        // own bookings) isn't enforced yet - see note below.
                        .requestMatchers("/api/bookings/**")
                        .hasAnyRole("CUSTOMER", "PARTNER", "ADMIN")

                        .anyRequest().authenticated());

        return http.build();
    }
}
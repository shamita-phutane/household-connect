package com.backend.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.backend.auth.dto.LoginRequestDto;
import com.backend.auth.dto.LoginResponseDto;
import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;
import com.backend.security.JwtService;
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public LoginResponseDto login(LoginRequestDto request) {

        // Let BadCredentialsException / DisabledException propagate naturally -
        // GlobalExceptionHandler maps them to proper 401 / 403 responses.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

    	User user = userRepository.findByEmail(request.getEmail())
    	        .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        String token = jwtService.generateToken(user);

        return new LoginResponseDto(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name());
    }
}
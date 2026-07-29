package com.backend.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.backend.auth.dto.LoginRequestDto;
import com.backend.auth.dto.LoginResponseDto;
import com.backend.auth.entity.AuthUser;
import com.backend.auth.repository.AuthUserRepository;
import com.backend.auth.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthUserRepository authUserRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       AuthUserRepository authUserRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.authUserRepository = authUserRepository;
    }

    public LoginResponseDto login(LoginRequestDto request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        AuthUser user = authUserRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(user);

        return new LoginResponseDto(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name());
    }
}
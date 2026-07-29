package com.backend.auth.security;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.backend.auth.entity.AuthUser;
import com.backend.auth.repository.AuthUserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AuthUserRepository authUserRepository;

    public CustomUserDetailsService(AuthUserRepository authUserRepository) {
        this.authUserRepository = authUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        AuthUser authUser = authUserRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Invalid email or password"));

        return new AuthUserDetails(authUser);
    }
}
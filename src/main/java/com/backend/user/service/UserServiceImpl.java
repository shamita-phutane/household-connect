package com.backend.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.common.enums.Role;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.InvalidRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.security.AuthUtils;
import com.backend.user.dto.UserRequestDto;
import com.backend.user.dto.UserResponseDto;
import com.backend.user.entity.User;
import com.backend.user.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponseDto registerUser(UserRequestDto requestDto) {

        // Public self-registration must never be able to mint an ADMIN account.
        // Admins are created separately (e.g. directly by an existing admin/DB seed).
        if (requestDto.getRole() == Role.ADMIN) {
            throw new InvalidRequestException(
                    "Self-registration as ADMIN is not allowed");
        }

        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already exists: " + requestDto.getEmail());
        }

        if (userRepository.existsByPhone(requestDto.getPhone())) {
            throw new DuplicateResourceException(
                    "Phone number already exists: " + requestDto.getPhone());
        }

        User user = User.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .phone(requestDto.getPhone())
                .city(requestDto.getCity())
                .role(requestDto.getRole())
                .avgRating(0.0)
                .verified(true) // auto-verified on signup, no separate approval step
                .build();

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    @Override
    public UserResponseDto getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        return convertToResponse(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(Long userId,
                                      UserRequestDto requestDto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        userRepository.findByEmail(requestDto.getEmail())
                .filter(existing -> !existing.getUserId().equals(userId))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Email already exists: " + requestDto.getEmail());
                });

        userRepository.findByPhone(requestDto.getPhone())
                .filter(existing -> !existing.getUserId().equals(userId))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Phone number already exists: " + requestDto.getPhone());
                });

        // A user's role can only be changed by an admin. Without this, any user
        // could PUT their own profile with role=ADMIN and grant themselves access.
        if (requestDto.getRole() != user.getRole() && !AuthUtils.isAdmin()) {
            throw new InvalidRequestException(
                    "Only an admin can change a user's role");
        }

        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());

        // Encode password before storing
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        user.setPhone(requestDto.getPhone());
        user.setCity(requestDto.getCity());
        user.setRole(requestDto.getRole());

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        userRepository.delete(user);
    }

    private UserResponseDto convertToResponse(User user) {

        return UserResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .city(user.getCity())
                .role(user.getRole())
                .avgRating(user.getAvgRating())
                .verified(user.getVerified())
                .build();
    }
}
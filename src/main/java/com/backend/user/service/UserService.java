package com.backend.user.service;
import java.util.List;

import com.backend.user.dto.UserRequestDto;
import com.backend.user.dto.UserResponseDto;
public interface UserService {
	 // Register a new user
    UserResponseDto registerUser(UserRequestDto userRequestDto);

    // Get user by ID
    UserResponseDto getUserById(Long userId);

    // Get all users
    List<UserResponseDto> getAllUsers();

    // Update user details
    UserResponseDto updateUser(Long userId, UserRequestDto userRequestDto);

    // Delete user
    void deleteUser(Long userId);

    List<UserResponseDto> getPartnersByService(Long serviceId);
}

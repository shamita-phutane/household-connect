package com.backend.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.backend.user.dto.UserRequestDto;
import com.backend.user.dto.UserResponseDto;
import com.backend.user.service.UserService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Public - this is the signup endpoint, must be reachable without a token.
    // Also permitAll()'d in SecurityConfig for POST /api/users specifically.
    @PostMapping
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserRequestDto requestDto) {
        UserResponseDto response = userService.registerUser(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // A user can view their own profile; only an admin can view someone else's.
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.user.userId == #userId")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // Listing every user's data is admin-only.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // A user can edit their own profile; only an admin can edit someone else's.
    // (Role changes specifically are additionally gated inside UserServiceImpl.)
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.user.userId == #userId")
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserRequestDto requestDto) {
        return ResponseEntity.ok(userService.updateUser(userId, requestDto));
    }

    // Account deletion is admin-only for now (no self-delete flow/confirmation
    // step exists yet - add one if you want users to be able to close their own
    // account).
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}



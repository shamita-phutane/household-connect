package com.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.backend.common.enums.Role;
import com.backend.user.entity.User;

/**
 * Utility class to fetch the currently authenticated user
 * from Spring Security context.
 */
public final class AuthUtils {

    private AuthUtils() {
    }

    public static User currentUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            return userDetails.getUser();
        }

        throw new IllegalStateException("Invalid authentication principal");
    }

    public static Long currentUserId() {
        return currentUser().getUserId();
    }

    public static Role currentUserRole() {
        return currentUser().getRole();
    }

    public static boolean isAdmin() {
        return currentUserRole() == Role.ADMIN;
    }

    public static boolean isSelf(Long userId) {
        return userId != null && userId.equals(currentUserId());
    }
}
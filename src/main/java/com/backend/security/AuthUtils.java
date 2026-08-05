package com.backend.security;

import org.springframework.security.core.context.SecurityContextHolder;

import com.backend.common.enums.Role;
import com.backend.user.entity.User;

/**
 * Small helper for reading the currently authenticated user out of the
 * security context. Used across service classes to enforce "only the
 * owner of this record, or an admin, can do this" style checks that go
 * beyond what a simple @PreAuthorize/route role rule can express (e.g.
 * "only THIS booking's customer", not "any customer").
 */
public final class AuthUtils {

    private AuthUtils() {
    }

    public static User currentUser() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            return userDetails.getUser();
        }
        throw new IllegalStateException("No authenticated user found in security context");
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

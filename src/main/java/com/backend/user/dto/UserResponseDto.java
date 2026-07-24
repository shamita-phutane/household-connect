package com.backend.user.dto;
import com.backend.common.enums.Role;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    private Long userId;

    private String name;

    private String email;

    private String phone;

    private String city;

    private Role role;

    private Double avgRating;

    private Boolean verified;
}

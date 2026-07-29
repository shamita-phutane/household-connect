package com.backend.user.dto;
import com.backend.common.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDto {
	 @NotBlank(message = "Name is required")
	    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
	    private String name;

	    @NotBlank(message = "Email is required")
	    @Email(message = "Invalid email format")
	    private String email;

	    @NotBlank(message = "Password is required")
	    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
	    private String password;

	    @NotBlank(message = "Phone number is required")
	    @Pattern(
	            regexp = "^[6-9]\\d{9}$",
	            message = "Enter a valid 10-digit mobile number")
	    private String phone;

	    @NotBlank(message = "City is required")
	    private String city;

	    @NotNull(message = "Role is required")
	    private Role role;
}

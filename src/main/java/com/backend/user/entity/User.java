package com.backend.user.entity;
import com.backend.common.enums.Role;
import java.util.List;

import com.backend.booking.entity.Booking;

import jakarta.persistence.OneToMany;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long userId;

@NotBlank(message="Name is required")
@Size(min =3, max= 100,message="Name must be between 3 and 100 characters")
@Column(nullable=false,length=100)
private String name;

@NotBlank(message="Email is required")
@Email(message="Invalid email format")
@Column(nullable=false, unique =true, length=100)
private String email;

@NotBlank(message="Password is required")
@Size ( min=8,max=20, message="password must be between 8 and 20")
@Column(nullable=false)
private String password;

@NotBlank(message="Phone number is required")
@Pattern(
		regexp="^[6-9]\\d{9}$",
		message="Enter a valid 10-digit mobile number"
		)
@Column(nullable=false,unique=true,length=10) 
private String phone;

@NotBlank(message="City is required")
@Column(nullable=false,length=50)
private String city;

@NotNull(message = "Role is required")
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private Role role;

@Column(name = "avg_rating")
private Double avgRating;

@NotNull(message = "Verification status is required")
@Column(nullable = false)
private Boolean verified;
@OneToMany(mappedBy = "customer")
private List<Booking> customerBookings;
@OneToMany(mappedBy = "partner")
private List<Booking> assignedBookings;
}

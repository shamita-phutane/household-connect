package com.backend.review.entity;
import com.backend.review.entity.Review;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.backend.booking.entity.Booking;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    @Column(nullable = false)
    private Integer rating;

    @NotBlank(message = "Comment is required")
    @Column(nullable = false, length = 500)
    private String comment;
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

}

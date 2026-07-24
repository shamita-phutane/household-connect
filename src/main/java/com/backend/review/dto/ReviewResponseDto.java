package com.backend.review.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDto {

    private Long reviewId;
    private Integer rating;
    private String comment;
    private Long bookingId;
}
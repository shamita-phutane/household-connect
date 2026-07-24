package com.backend.review.service;

import java.util.List;

import com.backend.review.dto.ReviewRequestDto;
import com.backend.review.dto.ReviewResponseDto;

public interface ReviewService {

    // Create a review for a booking (only allowed if booking is COMPLETED)
    ReviewResponseDto createReview(ReviewRequestDto requestDto);

    // Get review by ID
    ReviewResponseDto getReviewById(Long reviewId);

    // Get review for a specific booking
    ReviewResponseDto getReviewByBooking(Long bookingId);

    // Get all reviews
    List<ReviewResponseDto> getAllReviews();

    // Delete a review
    void deleteReview(Long reviewId);
}
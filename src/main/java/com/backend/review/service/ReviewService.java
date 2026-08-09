package com.backend.review.service;

import java.util.List;

import com.backend.review.dto.ReviewRequestDto;
import com.backend.review.dto.ReviewResponseDto;

public interface ReviewService {

    ReviewResponseDto createReview(ReviewRequestDto requestDto);

    ReviewResponseDto getReviewById(Long reviewId);

    ReviewResponseDto getReviewByBooking(Long bookingId);

    List<ReviewResponseDto> getAllReviews();

    // Delete a review
    void deleteReview(Long reviewId);
}
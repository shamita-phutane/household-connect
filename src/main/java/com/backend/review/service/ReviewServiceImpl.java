package com.backend.review.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.booking.entity.Booking;
import com.backend.booking.repository.BookingRepository;
import com.backend.common.enums.BookingStatus;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.InvalidRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.review.dto.ReviewRequestDto;
import com.backend.review.dto.ReviewResponseDto;
import com.backend.review.entity.Review;
import com.backend.review.repository.ReviewRepository;
import com.backend.security.AuthUtils;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public ReviewResponseDto createReview(ReviewRequestDto requestDto) {

        Booking booking = bookingRepository.findById(requestDto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + requestDto.getBookingId()));

        // Only the customer who booked the service can review it.
        if (!AuthUtils.isAdmin() && !AuthUtils.isSelf(booking.getCustomer().getUserId())) {
            throw new AccessDeniedException("You can only review your own bookings");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new InvalidRequestException(
                    "Cannot review booking with id " + requestDto.getBookingId()
                            + " because its status is " + booking.getStatus() + ", not COMPLETED");
        }

        if (reviewRepository.existsByBooking_BookingId(requestDto.getBookingId())) {
            throw new DuplicateResourceException(
                    "Review already exists for booking id: " + requestDto.getBookingId());
        }

        Review review = Review.builder()
                .rating(requestDto.getRating())
                .comment(requestDto.getComment())
                .booking(booking)
                .build();

        Review savedReview = reviewRepository.save(review);

        return convertToResponse(savedReview);
    }

    // Reviews are treated as public-ish, viewable by any signed-in user
    // (a customer browsing a partner's reputation, a partner checking their
    // own feedback, etc.) so reads are intentionally left unrestricted here.
    @Override
    public ReviewResponseDto getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        return convertToResponse(review);
    }

    @Override
    public ReviewResponseDto getReviewByBooking(Long bookingId) {
        Review review = reviewRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Review not found for booking id: " + bookingId));
        return convertToResponse(review);
    }

    @Override
    public List<ReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        boolean isAuthor = AuthUtils.isSelf(review.getBooking().getCustomer().getUserId());
        if (!AuthUtils.isAdmin() && !isAuthor) {
            throw new AccessDeniedException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponseDto convertToResponse(Review review) {
        return ReviewResponseDto.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .comment(review.getComment())
                .bookingId(review.getBooking().getBookingId())
                .build();
    }
}
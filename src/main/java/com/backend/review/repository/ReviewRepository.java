package com.backend.review.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.review.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByBooking_BookingId(Long bookingId);

    boolean existsByBooking_BookingId(Long bookingId);
}
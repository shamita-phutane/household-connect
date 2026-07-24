package com.backend.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.booking.entity.Booking;
import com.backend.common.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer_UserId(Long customerId);

    List<Booking> findByPartner_UserId(Long partnerId);

    List<Booking> findByStatus(BookingStatus status);
}
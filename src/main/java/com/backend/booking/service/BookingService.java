package com.backend.booking.service;

import java.util.List;

import com.backend.booking.dto.BookingRequestDto;
import com.backend.booking.dto.BookingResponseDto;
import com.backend.common.enums.BookingStatus;

public interface BookingService {

    // Create a new booking (status defaults to PENDING, partner unassigned)
    BookingResponseDto createBooking(BookingRequestDto requestDto);

    // Get booking by ID
    BookingResponseDto getBookingById(Long bookingId);

    // Get all bookings
    List<BookingResponseDto> getAllBookings();

    // Get all bookings for a specific customer
    List<BookingResponseDto> getBookingsByCustomer(Long customerId);

    // Get all bookings assigned to a specific partner
    List<BookingResponseDto> getBookingsByPartner(Long partnerId);

    // Assign a partner to a booking
    BookingResponseDto assignPartner(Long bookingId, Long partnerId);

    // Update booking status (e.g. ACCEPTED, COMPLETED, CANCELLED)
    BookingResponseDto updateStatus(Long bookingId, BookingStatus status);

    // Delete a booking
    void deleteBooking(Long bookingId);
}
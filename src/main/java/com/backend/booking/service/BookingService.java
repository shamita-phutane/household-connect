package com.backend.booking.service;

import java.util.List;

import com.backend.booking.dto.BookingRequestDto;
import com.backend.booking.dto.BookingResponseDto;
import com.backend.common.enums.BookingStatus;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto requestDto);
    BookingResponseDto getBookingById(Long bookingId);
    List<BookingResponseDto> getAllBookings();
    List<BookingResponseDto> getBookingsByCustomer(Long customerId);
    List<BookingResponseDto> getBookingsByPartner(Long partnerId);
    BookingResponseDto assignPartner(Long bookingId, Long partnerId);
    BookingResponseDto updateStatus(Long bookingId, BookingStatus status);
    void deleteBooking(Long bookingId);
}
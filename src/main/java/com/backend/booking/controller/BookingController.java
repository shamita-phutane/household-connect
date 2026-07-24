package com.backend.booking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.booking.dto.BookingRequestDto;
import com.backend.booking.dto.BookingResponseDto;
import com.backend.booking.service.BookingService;
import com.backend.common.enums.BookingStatus;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto requestDto) {
        BookingResponseDto response = bookingService.createBooking(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }

    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByPartner(@PathVariable Long partnerId) {
        return ResponseEntity.ok(bookingService.getBookingsByPartner(partnerId));
    }

    @PatchMapping("/{bookingId}/assign-partner/{partnerId}")
    public ResponseEntity<BookingResponseDto> assignPartner(
            @PathVariable Long bookingId,
            @PathVariable Long partnerId) {
        return ResponseEntity.ok(bookingService.assignPartner(bookingId, partnerId));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponseDto> updateStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, status));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
}
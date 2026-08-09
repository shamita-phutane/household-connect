package com.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import com.backend.booking.repository.BookingRepository;
import com.backend.booking.entity.Booking;
import com.backend.common.enums.BookingStatus;
import com.backend.user.repository.UserRepository;
import com.backend.services.repository.ServicesRepository;
import java.time.LocalDate;
import java.time.LocalTime;

@SpringBootTest
public class FixDbTest {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServicesRepository servicesRepository;

    @Test
    public void testInsertBooking() {
        try {
            System.out.println("====== ATTEMPTING DUMMY INSERT ======");
            Booking b = new Booking();
            b.setDate(LocalDate.now().plusDays(1));
            b.setBookingTime(LocalTime.of(10, 0));
            b.setStatus(BookingStatus.PENDING);
            b.setFinalAmount(100.0);
            b.setServiceAddress("Test Address");
            
            // Just grab first user and service if available
            userRepository.findAll().stream().findFirst().ifPresent(b::setCustomer);
            servicesRepository.findAll().stream().findFirst().ifPresent(b::setService);

            if (b.getCustomer() != null && b.getService() != null) {
                bookingRepository.save(b);
                System.out.println("====== INSERT SUCCESSFUL! ======");
                bookingRepository.delete(b);
            } else {
                System.out.println("====== NO USER OR SERVICE TO TEST INSERT ======");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("====== INSERT FAILED! ======");
        }
    }
}

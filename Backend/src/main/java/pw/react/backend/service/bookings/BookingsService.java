package pw.react.backend.service.bookings;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import pw.react.backend.dao.specifications.BookingDatesSpecification;
import pw.react.backend.model.Booking;

import java.util.List;

public interface BookingsService {
    Page<Booking> getBookings(Specification<Booking> bookingSpecification, Pageable pageable);
    Booking postBooking(Booking booking, long customerId, long flatId);
    Booking getBooking(Long bookingId);
    boolean cancelBooking(Long bookingId);
    List<Long> cancelBookingsByFlatId(Long flatId);
    List<Booking> getBookingsInDateRange(BookingDatesSpecification bookingDatesSpecification);
}

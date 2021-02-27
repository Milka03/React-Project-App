package pw.react.backend.service.bookings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pw.react.backend.dao.BookingsRepository;
import pw.react.backend.dao.specifications.BookingDatesSpecification;
import pw.react.backend.model.Booking;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Boolean.FALSE;

@Service
class BookingsMainService implements BookingsService {
    private final Logger logger = LoggerFactory.getLogger(BookingsMainService.class);

    private BookingsRepository repository;

    BookingsMainService() { /*Needed only for initializing spy in unit tests*/}

    @Autowired
    BookingsMainService(BookingsRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<Booking> getBookings(Specification<Booking> bookingSpecification, Pageable pageable) {
        logger.info("Bookings requested.");
        return repository.findAll(bookingSpecification, pageable);
    }

    @Override
    public Booking postBooking(Booking booking, long customerId, long flatId)
    {
        Booking result = new Booking();

        try {
            booking.setCustomerId(customerId);
            booking.setPrice((int) ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) * booking.getFlat().getPrice());
            try {
                result = repository.save(booking);
            } catch (DataIntegrityViolationException e) {
                logger.error(String.format("Failed to save booking %s", e.getMessage()));
            }
        } catch (Exception e)
        {
            logger.error(String.format("Failed to save booking %s", e.getMessage()));
        }
        return result;
    }

    @Override
    public Booking getBooking(Long bookingId) {
        Booking result = null;
        if (repository.existsById(bookingId)) {
            logger.info("Booking with id {} requested.", bookingId);
            result = repository.getOne(bookingId);
        }
        else logger.info("Booking with id {} requested, but no such booking was found.", bookingId);
        return result;
    }

    @Override
    public boolean cancelBooking(Long bookingId) {
        boolean result = false;
        if (repository.existsById(bookingId)) {
            Booking booking = repository.getOne(bookingId);
            booking.setActive(FALSE);
            repository.save(booking);
            logger.info("Booking with id {} cancelled.", bookingId);
            result = true;
        }
        else logger.info("Booking with id {} requested to be cancelled, but no such booking was found.", bookingId);
        return result;
    }

    @Override
    public List<Long> cancelBookingsByFlatId(Long flatId) {
        List<Long> result = new ArrayList<>();
        List<Booking> bookingsToCancel = repository.findAllByFlatId(flatId);
        for (Booking toCancel : bookingsToCancel) {
            toCancel.setActive(FALSE);
            toCancel.setFlat(null);
            repository.save(toCancel);
            result.add(toCancel.getId());
        }
        logger.info("Bookings with id {} cancelled",
                result.stream().map(Object::toString).collect(Collectors.joining(",")));
        return result;
    }

    @Override
    public List<Booking> getBookingsInDateRange(BookingDatesSpecification bookingDatesSpecification)
    {
        return repository.findAll(bookingDatesSpecification);
    }
}

package pw.react.backend.controller.external;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.react.backend.appException.UnauthorizedException;
import pw.react.backend.controller.internal.BookingsController;
import pw.react.backend.dao.specifications.BookingSpecification;
import pw.react.backend.model.Booking;
import pw.react.backend.model.InboundBooking;
import pw.react.backend.service.FlatsService;
import pw.react.backend.service.bookings.BookingsService;
import pw.react.backend.service.general.SecurityProvider;

import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping("/ext/bookings")
public class BookingsExtController
{
    private final Logger logger = LoggerFactory.getLogger(BookingsController.class);
    private final SecurityProvider securityService;
    private final BookingsService bookingsService;
    private final FlatsService flatsService;

    @Autowired
    public BookingsExtController(SecurityProvider securityService, BookingsService bookingsService, FlatsService flatsService)
    {
        this.securityService = securityService;
        this.bookingsService = bookingsService;
        this.flatsService = flatsService;
    }

    private void logHeaders(@RequestHeader HttpHeaders headers) {
        logger.info("Controller request headers {}",
                headers.entrySet()
                        .stream()
                        .map(entry -> String.format("%s->[%s]", entry.getKey(), String.join(",", entry.getValue())))
                        .collect(joining(","))
        );
    }

    @GetMapping(path = "")
    public ResponseEntity<Page<Booking>> getBookings(@RequestHeader HttpHeaders headers,
                                                     @RequestParam(value = "apiKey", required = false) String apiKey,
                                                     BookingSpecification bookingSpecification,
                                                     @PageableDefault(size = 10) Pageable pageable) {
        logHeaders(headers);
        if (securityService.isApiKeyValid(apiKey)) {
            return ResponseEntity.ok(bookingsService.getBookings(bookingSpecification, pageable));
        }
        throw new UnauthorizedException("Get Bookings request is unauthorized");
    }

    @PostMapping(path = "")
    public ResponseEntity<Booking> postBookings(@RequestHeader HttpHeaders headers,
                                                @RequestParam(value = "apiKey", required = false) String apiKey,
                                                @RequestBody InboundBooking inboundBooking) {
        logHeaders(headers);
        var booking = new Booking();
        booking.setStartDate(inboundBooking.getStartDate());
        booking.setEndDate(inboundBooking.getEndDate());
        booking.setPrice(inboundBooking.getPrice());
        booking.setNoOfGuests(inboundBooking.getNoOfGuests());
        if (securityService.isApiKeyValid(apiKey))
        {
            var flat = flatsService.getFlat(inboundBooking.getFlatId());
            if (flat.isPresent())
            {
                booking.setFlat(flat.get());
                var result = bookingsService.postBooking(booking, inboundBooking.getCustomerId(), inboundBooking.getFlatId());
                if (result.getId() == 0) {
                    return ResponseEntity.badRequest().body(Booking.EMPTY);
                }
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.badRequest().body(Booking.EMPTY);
        }
        throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @GetMapping(path = "/{bookingId}")
    public ResponseEntity<Booking> getBooking(@RequestHeader HttpHeaders headers,
                                              @RequestParam(value = "apiKey", required = false) String apiKey,
                                              @PathVariable Long bookingId) {
        logHeaders(headers);
        if (securityService.isApiKeyValid(apiKey)) {
            Booking booking = bookingsService.getBooking(bookingId);
            if (booking == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Booking.EMPTY);
            }
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Booking.EMPTY);
    }

    @DeleteMapping(path = "/{bookingId}")
    public ResponseEntity<String> deleteBooking(@RequestHeader HttpHeaders headers,
                                                @RequestParam(value = "apiKey", required = false) String apiKey,
                                                @PathVariable Long bookingId) {
        logHeaders(headers);
        if (securityService.isApiKeyValid(apiKey)) {
            boolean deleted = bookingsService.cancelBooking(bookingId);
            if (!deleted) {
                return ResponseEntity.badRequest().body(String.format("Booking with id %s does not exist.", bookingId));
            }
            return ResponseEntity.ok(String.format("Booking with id %s cancelled.", bookingId));
        }
        throw new UnauthorizedException("Unauthorized access to resources.");
    }
}

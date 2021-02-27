package pw.react.backend.controller.internal;


import com.fasterxml.jackson.databind.ObjectMapper;
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
import pw.react.backend.dao.specifications.BookingSpecification;
import pw.react.backend.model.Booking;
import pw.react.backend.model.Customer;
import pw.react.backend.model.InboundCustomer;
import pw.react.backend.service.bookings.BookingsService;
import pw.react.backend.service.FlatsService;
import pw.react.backend.service.general.SecurityProvider;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping("/bookings")
public class BookingsController
{
    private final Logger logger = LoggerFactory.getLogger(BookingsController.class);
    private final SecurityProvider securityService;
    private final BookingsService bookingsService;

    @Autowired
    public BookingsController(SecurityProvider securityService, BookingsService bookingsService, FlatsService flatsService)
    {
        this.securityService = securityService;
        this.bookingsService = bookingsService;
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
                                                     BookingSpecification bookingSpecification,
                                                     @PageableDefault(size = 10) Pageable pageable) {
        logHeaders(headers);
        if (securityService.isAuthorized(headers)) {
            return ResponseEntity.ok(bookingsService.getBookings(bookingSpecification, pageable));
        }
        throw new UnauthorizedException("Get Bookings request is unauthorized");
    }

    @GetMapping(path = "/{bookingId}")
    public ResponseEntity<Booking> getBooking(@RequestHeader HttpHeaders headers,
                                              @PathVariable Long bookingId) {
        logHeaders(headers);
        if (securityService.isAuthorized(headers)) {
            Booking booking = bookingsService.getBooking(bookingId);
            if (booking == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Booking.EMPTY);
            }
            Customer customer = getCustomerFromRequest(booking.getCustomerId());
            booking.setCustomer(customer);
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Booking.EMPTY);
    }

    @DeleteMapping(path = "/{bookingId}")
    public ResponseEntity<String> deleteBooking(@RequestHeader HttpHeaders headers,
                                                @PathVariable Long bookingId) {
        logHeaders(headers);
        if (securityService.isAuthorized(headers)) {
            boolean deleted = bookingsService.cancelBooking(bookingId);
            if (!deleted) {
                return ResponseEntity.badRequest().body(String.format("Booking with id %s does not exist.", bookingId));
            }
            return ResponseEntity.ok(String.format("Booking with id %s cancelled", bookingId));
        }
        throw new UnauthorizedException("Unauthorized access to resources.");
    }


    private Customer getCustomerFromRequest(long id) {
        try {
            URL url = new URL(String.format("http://booklybackend-env.eba-pzvyseyf.us-east-2.elasticbeanstalk.com/v1/users/%d", id));
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Security-Token", "f0e9b356-d597-4cbf-b8ef-4f61d038f66d");
            con.setConnectTimeout(15000);
            con.setReadTimeout(15000);

            int status = con.getResponseCode();
            logger.info(String.format("%d", status));
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            logger.info(content.toString());

            ObjectMapper objectMapper = new ObjectMapper();
            InboundCustomer inbaCustomer = objectMapper.readValue(content.toString(), InboundCustomer.class);
            Customer customer = new Customer();

            customer.setId(inbaCustomer.getId());
            customer.setFirstName(inbaCustomer.getFirstName());
            customer.setLastName(inbaCustomer.getLastName());
            customer.setPhoneNumber(inbaCustomer.getPhoneNumber());

            return customer;
        }
        catch (Exception e) {
            logger.info(e.toString());
            return new Customer();
        }
    }
}
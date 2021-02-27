package pw.react.backend.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class InboundBooking
{
    private LocalDate startDate;
    private LocalDate endDate;
    private int price;
    private int noOfGuests;

    private long customerId;
    private long flatId;

}

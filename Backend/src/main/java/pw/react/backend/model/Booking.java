package pw.react.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

import static java.lang.Boolean.TRUE;

@Data
@Entity
@Table(name = "bookings")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking implements Serializable
{
    private static final long serialVersionUID = -6783504532088859179L;

    public static Booking EMPTY = new Booking();

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    @NotNull
    private int price;
    @NotNull
    private int noOfGuests;

    private boolean isActive = TRUE;

    private long customerId;

    @ManyToOne
    @JoinColumn(name = "flat_id")
    private Flat flat;

    private transient Customer customer = new Customer();
}
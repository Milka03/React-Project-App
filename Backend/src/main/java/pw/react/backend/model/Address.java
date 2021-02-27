package pw.react.backend.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "addresses")
public class Address implements Serializable
{
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;


    @Column(nullable = false)
    private String country;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String streetName;
    @Column(nullable = false)
    private String postCode;
    @Column(nullable = false)
    private String buildingNumber;
    private String flatNumber;

    @OneToOne(mappedBy = "address")
    private transient Flat flat;
}
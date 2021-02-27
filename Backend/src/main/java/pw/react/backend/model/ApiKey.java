package pw.react.backend.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "api")
public class ApiKey implements Serializable
{
    private static final long serialVersionUID = -6783504532088859179L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(nullable = false)
    private String keyValue;
}

package pw.react.backend.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "users")
public class User
{
    private static final long serialVersionUID = -6783504532088859179L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
}

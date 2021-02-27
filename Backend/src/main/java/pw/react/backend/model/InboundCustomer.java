package pw.react.backend.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class InboundCustomer implements Serializable
{
    private long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String country;
    private String address;
    private String login;
    private String password;
    private String securityToken;
}

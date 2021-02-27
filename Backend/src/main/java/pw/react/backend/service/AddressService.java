package pw.react.backend.service;

import java.util.List;

public interface AddressService
{
    List<String> getCountries();
    List<String> getCities(String country);
    List<String> getCities();
}

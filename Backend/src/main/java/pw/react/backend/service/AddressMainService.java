package pw.react.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pw.react.backend.dao.AddressRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class AddressMainService implements AddressService
{
    private final Logger logger = LoggerFactory.getLogger(AddressMainService.class);

    AddressRepository repository;

    @Autowired
    AddressMainService(AddressRepository repository)
    {
        this.repository = repository;
    }

    @Override
    public List<String> getCountries()
    {
        logger.info("Fetching list of all countries");
        return repository.getCountries();
    }

    @Override
    public List<String> getCities(String country)
    {
        logger.info(String.format("Fetching list of all cities in %s", country));
        var cities = repository.getCities(country);
        return createPairs(cities);
    }

    @Override
    public List<String> getCities()
    {
        logger.info("Fetching list of all cities");
        var cities = repository.getCities();
        return createPairs(cities);
    }

    private List<String> createPairs(List<Object[]> cityCountryList)
    {
        List<String> output = new ArrayList<>();
        for (var array:cityCountryList)
            output.add(array[0].toString());
        return output;
    }
}

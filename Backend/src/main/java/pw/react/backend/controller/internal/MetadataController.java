package pw.react.backend.controller.internal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.react.backend.appException.UnauthorizedException;
import pw.react.backend.model.FlatType;
import pw.react.backend.service.AddressService;
import pw.react.backend.service.general.SecurityProvider;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping("/metadata")
public class MetadataController
{

    private final Logger logger = LoggerFactory.getLogger(MetadataController.class);
    private final SecurityProvider securityService;
    private final AddressService addressService;

    @Autowired
    public MetadataController(SecurityProvider securityService, AddressService addressService)
    {
        this.securityService = securityService;
        this.addressService = addressService;
    }

    private void logHeaders(@RequestHeader HttpHeaders headers)
    {
        logger.info("Controller request headers {}",
                headers.entrySet()
                        .stream()
                        .map(entry -> String.format("%s->[%s]", entry.getKey(), String.join(",", entry.getValue())))
                        .collect(joining(","))
        );
    }

    @GetMapping(path = "/countries")
    public ResponseEntity<List<String>> getCountries(@RequestHeader HttpHeaders headers)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            return ResponseEntity.ok(addressService.getCountries());
        }
        throw new UnauthorizedException("Get Bookings request is unauthorized");
    }

    @GetMapping(path = "/cities")
    public ResponseEntity<List<String>> getCities(@RequestHeader HttpHeaders headers,
                                          @RequestParam(value = "country", required = false) String country)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            if (country != null && !country.isEmpty())
                return ResponseEntity.ok(addressService.getCities(country));
            else
                return ResponseEntity.ok(addressService.getCities());
        }
        throw new UnauthorizedException("Get Bookings request is unauthorized");
    }

    @GetMapping(path = "/flat_types")
    public ResponseEntity<List<String>> getCities(@RequestHeader HttpHeaders headers)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            var enumNames = Arrays.stream(FlatType.values()).map(FlatType::name).collect(Collectors.toList());
            return ResponseEntity.ok(enumNames);
        }
        throw new UnauthorizedException("Get Bookings request is unauthorized");
    }
}

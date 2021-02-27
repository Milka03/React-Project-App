package pw.react.backend.controller.internal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.react.backend.appException.UnauthorizedException;
import pw.react.backend.model.User;
import pw.react.backend.service.general.SecurityProvider;

import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping("/login")
public class LoginController
{
    private final Logger logger = LoggerFactory.getLogger(LoginController.class);

    private final SecurityProvider securityService;

    @Autowired
    public LoginController(SecurityProvider securityService)
    {
        this.securityService = securityService;
    }

    private void logHeaders(@RequestHeader HttpHeaders headers) {
        logger.info("Controller request headers {}",
                headers.entrySet()
                        .stream()
                        .map(entry -> String.format("%s->[%s]", entry.getKey(), String.join(",", entry.getValue())))
                        .collect(joining(","))
        );
    }

    @PostMapping(path = "")
    public ResponseEntity<String> getFlats(@RequestHeader HttpHeaders headers, User user)
    {
        logHeaders(headers);
        String token = securityService.Authenticate(user);
        if (token.isEmpty())
            throw new UnauthorizedException("Invalid user");
        return ResponseEntity.ok(token);
    }

    @PostMapping(path = "/enc")
    public ResponseEntity<String> encode(@RequestHeader HttpHeaders headers,
                                         @RequestParam(value = "string") String string)
    {
        logHeaders(headers);
        return ResponseEntity.ok(securityService.Encode(string));
    }
}

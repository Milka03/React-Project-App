package pw.react.backend.service.general;

import org.springframework.http.HttpHeaders;
import pw.react.backend.model.User;

public interface SecurityProvider
{
    boolean isAuthenticated(HttpHeaders headers);
    boolean isAuthorized(HttpHeaders headers);
    String Authenticate(User user);
    String Encode(String string);
    boolean isApiKeyValid(String apiKey);
}

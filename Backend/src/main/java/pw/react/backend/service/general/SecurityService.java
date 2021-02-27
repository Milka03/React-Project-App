package pw.react.backend.service.general;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import pw.react.backend.dao.ApiKeyRepository;
import pw.react.backend.dao.UserRepository;
import pw.react.backend.model.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pw.react.backend.service.AddressMainService;

import java.util.Date;


@Service
class SecurityService implements SecurityProvider
{

    private static final String SECURITY_HEADER = "security-header";
    private final String SECURITY_HEADER_VALUE = "secureMe";
    private final String TOKEN_SIGNING_KEY = "G873Gg68g83g78";
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final ApiKeyRepository apiKeyRepository;
    private final Logger logger = LoggerFactory.getLogger(SecurityService.class);


    public SecurityService(UserRepository userRepository, ApiKeyRepository apiKeyRepository)
    {
        this.userRepository = userRepository;
        this.apiKeyRepository = apiKeyRepository;
        encoder = new BCryptPasswordEncoder();
    }

    @Override
    public boolean isAuthenticated(HttpHeaders headers)
    {
        if (headers == null || !headers.containsKey(SECURITY_HEADER))
            return false;

        String token = headers.getFirst(SECURITY_HEADER);
        if (token == null || token.isEmpty())
            return false;
        try {


        Claims claims = Jwts.parser().setSigningKey(TOKEN_SIGNING_KEY).parseClaimsJws(token).getBody();
        Integer uid = (Integer)claims.get("id");
        if (uid == null)
            return false;

        var savedUser = userRepository.findById(uid.longValue());
        return savedUser.isPresent() && savedUser.get().getUsername().equals(claims.getSubject());
        } catch (Exception e)
        {
            logger.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean isAuthorized(HttpHeaders headers)
    {
        return isAuthenticated(headers);
    }

    @Override
    public String Authenticate(User user)
    {
        var savedUser = userRepository.findByUsername(user.getUsername());
        String token = "";

        if (savedUser.isPresent() && user.getPassword() != null && encoder.matches(user.getPassword(), savedUser.get().getPassword()))
        {
            Long uid = savedUser.get().getId();
            token = Jwts.builder()
                    .setSubject(user.getUsername())
                    .claim("id", uid)
                    .setIssuedAt(new Date())
                    .signWith(SignatureAlgorithm.HS512, TOKEN_SIGNING_KEY).compact();
        }
        return token;
    }

    @Override
    public String Encode(String string)
    {
        return encoder.encode(string);
    }

    @Override
    public boolean isApiKeyValid(String apiKey)
    {
        if (apiKey == null || apiKey.isEmpty())
            return false;
        return apiKeyRepository.existsApiKeyByKeyValue(apiKey);
    }
}

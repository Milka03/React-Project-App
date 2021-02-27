package pw.react.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.react.backend.model.ApiKey;
import pw.react.backend.model.Booking;

import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long>
{
    boolean existsApiKeyByKeyValue(String key);
}

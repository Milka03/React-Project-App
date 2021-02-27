package pw.react.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.react.backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>
{
    Optional<User> findByUsername(String username);

    Boolean existsUserByUsername(String username);
}

package pw.react.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pw.react.backend.model.Flat;

public interface FlatRepository extends JpaRepository<Flat, Long>, JpaSpecificationExecutor<Flat>
{

}

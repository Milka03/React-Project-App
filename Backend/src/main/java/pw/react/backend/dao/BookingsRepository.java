package pw.react.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pw.react.backend.model.Booking;

import java.util.List;

public interface BookingsRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking>
{
    List<Booking> findAllByFlatId(long flat_id);
}
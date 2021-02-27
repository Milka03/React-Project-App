package pw.react.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pw.react.backend.model.Address;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>, JpaSpecificationExecutor<Address>
{
    @Query("select distinct country from Address")
    List<String> getCountries();

    @Query("select distinct city, country from Address")
    List<Object[]> getCities();

    @Query("select distinct city, country from Address where country=:country")
    List<Object[]> getCities(String country);
}

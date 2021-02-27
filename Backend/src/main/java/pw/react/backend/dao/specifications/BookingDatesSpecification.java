package pw.react.backend.dao.specifications;


import net.kaczmarzyk.spring.data.jpa.domain.GreaterThan;
import net.kaczmarzyk.spring.data.jpa.domain.LessThan;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.data.jpa.domain.Specification;
import pw.react.backend.model.Booking;


@And({
        @Spec(path = "startDate", params = "dateTo", spec = LessThan.class),
        @Spec(path = "endDate", params = "dateFrom", spec = GreaterThan.class)
})
public interface BookingDatesSpecification extends Specification<Booking>
{

}

package pw.react.backend.dao.specifications;

import net.kaczmarzyk.spring.data.jpa.domain.*;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.data.jpa.domain.Specification;
import pw.react.backend.model.Booking;

@And({
        @Spec(path = "flat.id", params = "flatId", spec = Equal.class),
        @Spec(path = "flat.name", params = "name", spec = Like.class),
        @Spec(path = "flat.address.city", params = "city", spec = Equal.class),
        @Spec(path = "flat.address.country", params = "country", spec = Equal.class),
        @Spec(path = "isActive", params = "omit_inactive", defaultVal = "true", spec = GreaterThanOrEqual.class),
        @Spec(path = "customerId", params = "customerId", spec = Equal.class),
        @Spec(path = "startDate", params = "dateFrom", spec = GreaterThanOrEqual.class),
        @Spec(path = "endDate", params = "dateTo", spec = LessThanOrEqual.class),
})
public interface BookingSpecification extends Specification<Booking> {}
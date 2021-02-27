package pw.react.backend.dao.specifications;

import net.kaczmarzyk.spring.data.jpa.domain.*;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.data.jpa.domain.Specification;
import pw.react.backend.model.Flat;

@And({
        @Spec(path = "name", params = "name", spec = Like.class),
        @Spec(path = "address.city", params = "city", spec = Equal.class),
        @Spec(path = "address.country", params = "country", spec = Equal.class),
        @Spec(path = "maxGuests", params = "guestsFrom", spec = GreaterThanOrEqual.class),
        @Spec(path = "maxGuests", params = "guestsTo", spec = LessThanOrEqual.class),
        @Spec(path = "price", params = "priceFrom", spec = GreaterThanOrEqual.class),
        @Spec(path = "price", params = "priceTo", spec = LessThanOrEqual.class),
})
public interface FlatSpecification extends Specification<Flat> {}
package pw.react.backend.dao.specifications;

import net.kaczmarzyk.spring.data.jpa.domain.*;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.data.jpa.domain.Specification;
import pw.react.backend.model.Flat;

@And({
        @Spec(path = "id", params = "bookedIds", paramSeparator = ',', spec = NotIn.class)
})
public interface FlatIDFilteringSpecification extends Specification<Flat>
{

}

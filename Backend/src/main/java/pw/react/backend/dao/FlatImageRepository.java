package pw.react.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.react.backend.model.FlatImage;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Transactional
public interface FlatImageRepository extends JpaRepository<FlatImage, String>
{
    List<FlatImage> getAllByFlatId(Long flatId);
    Optional<FlatImage> getFirstByFlatId(Long flatId);
    void deleteByFlatId(long flatId);
    void deleteByIdNotIn(List<String> ids);
    void deleteByFlatIdAndIdNotIn(long flatId, Collection<String> id);
}

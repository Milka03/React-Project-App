package pw.react.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;
import pw.react.backend.dao.specifications.BookingDatesSpecification;
import pw.react.backend.model.Flat;

import java.util.List;
import java.util.Optional;

public interface FlatsService
{
    Page<Flat> getFlats(Specification<Flat> flatSpecification, Pageable pageable);
    Optional<Flat> getFlat(Long flatId);
    Optional<Flat> saveFlat(Flat flat, List<MultipartFile> newImages);
    Flat updateFlat(Long id, Flat updatedFlat, List<MultipartFile> newImages);
    boolean deleteFlat(Long flatId);
    long[] getBookedFlatsIndexes(BookingDatesSpecification bookingDatesSpecification);
}

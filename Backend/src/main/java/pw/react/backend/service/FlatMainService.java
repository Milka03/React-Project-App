package pw.react.backend.service;

import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pw.react.backend.dao.FlatRepository;
import pw.react.backend.dao.specifications.BookingDatesSpecification;
import pw.react.backend.model.Flat;
import pw.react.backend.service.bookings.BookingsService;

import java.util.List;
import java.util.Optional;

@Service
@NoArgsConstructor
public class FlatMainService implements FlatsService
{
    private final Logger logger = LoggerFactory.getLogger(FlatMainService.class);

    FlatRepository repository;
    FlatImageService imageService;
    BookingsService bookingsService;

    @Autowired
    FlatMainService(FlatRepository repository, FlatImageService imageService, BookingsService bookingsService)
    {
        this.repository = repository;
        this.imageService = imageService;
        this.bookingsService = bookingsService;
    }

    @Override
    public Flat updateFlat(Long flatId, Flat updatedFlat, List<MultipartFile> newImages)
    {
        Flat result = Flat.Empty;
        var savedFlat = getFlat(flatId);
        if (savedFlat.isPresent())
        {
            updatedFlat.getAddress().setId(savedFlat.get().getAddress().getId());
            result = repository.save(updatedFlat);
            imageService.deleteRemovedImages(updatedFlat.getImages(), result.getId());
            if (!newImages.isEmpty())
            {
                var addedImages = imageService.storeImages(flatId, newImages);
                updatedFlat.getImages().addAll(addedImages);
            }
            updatedFlat.getImages().forEach(flatImage -> flatImage.setData(null));

            result.setImages(updatedFlat.getImages());
            logger.info("Flat with id {} updated.", flatId);
        }
        return result;
    }

    @Override
    public boolean deleteFlat(Long flatId)
    {
        boolean result = false;
        if (repository.existsById(flatId))
        {
            var cancelledBookings =  bookingsService.cancelBookingsByFlatId(flatId);
            imageService.deleteImagesForFlat(flatId);
            repository.deleteById(flatId);
            logger.info(String.format("Cancelled bookings: %s", cancelledBookings.toString()));
            logger.info(String.format("Flat with id %d deleted.", flatId));
            result = true;
        }
        return result;
    }

    @Override
    public long[] getBookedFlatsIndexes(BookingDatesSpecification bookingDatesSpecification)
    {
        var bookings = bookingsService.getBookingsInDateRange(bookingDatesSpecification);
        if (bookings.isEmpty())
            return new long[]{};
        return bookings.stream().mapToLong(booking -> booking.getFlat().getId()).toArray();
    }

    @Override
    public Optional<Flat> saveFlat(Flat flat, List<MultipartFile> newImages)
    {
        Optional<Flat> result = Optional.empty();
        try {
            result = Optional.of(repository.save(flat));
            var addedImages = imageService.storeImages(result.get().getId(), newImages);
            addedImages.forEach(flatImage -> flatImage.setData(null));
            result.get().setImages(addedImages);
        } catch (DataIntegrityViolationException e) {
            logger.error(String.format("Failed to save flats %s", e.getMessage()));
        }

        return result;
    }

    @Override
    public Page<Flat> getFlats(Specification<Flat> flatSpecification, Pageable pageable)
    {
        var flats = repository.findAll(flatSpecification, pageable);
        flats.forEach(flat -> {
            var image = imageService.getFirstImage(flat.getId());
            image.ifPresent(flatImage -> flat.setImages(List.of(flatImage)));
        });
        return flats;
    }

    @Override
    public Optional<Flat> getFlat(Long flatId)
    {
        var flat = repository.findById(flatId);
        flat.ifPresent(flat1 -> flat1.setImages(imageService.getFlatImages(flat1.getId())));
        return flat;
    }

}

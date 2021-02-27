package pw.react.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import pw.react.backend.appException.InvalidFileException;
import pw.react.backend.appException.ResourceNotFoundException;
import pw.react.backend.dao.FlatImageRepository;
import pw.react.backend.model.FlatImage;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.joining;

@Service
public class FlatImageService implements ImageService
{
    private final Logger logger = LoggerFactory.getLogger(ImageService.class);
    FlatImageRepository repository;

    @Autowired
    public FlatImageService(FlatImageRepository repository)
    {
        this.repository = repository;
    }

    @Override
    public List<FlatImage> storeImages(long flatId, List<MultipartFile> files)
    {
        List<FlatImage> saved = new ArrayList<>();
        for (MultipartFile file : files)
        {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty())
                continue;
            fileName = StringUtils.cleanPath(fileName);
            try
            {
                if (fileName.contains(".."))
                    throw new InvalidFileException("Sorry! Filename contains invalid path sequence " + fileName);
                FlatImage newImage = new FlatImage(fileName, file.getContentType(), flatId, file.getBytes());
                saved.add(repository.save(newImage));
                logger.info(String.format("Saved picture with id %s for flat %d", newImage.getId(), newImage.getFlatId()));
            } catch (IOException ex) {
                throw new InvalidFileException("Could not store file " + fileName + ". Please try again!", ex);
            }
        }
        return saved;
    }

    @Override
    public List<FlatImage> getFlatImages(long flatId)
    {
        return repository.getAllByFlatId(flatId);
    }

    @Override
    public Optional<FlatImage> getFirstImage(long flatId)
    {
        return repository.getFirstByFlatId(flatId);
    }

    @Override
    public void deleteFlatImage(long flatId, String imageId)
    {
        if (repository.findById(imageId).isPresent()) {
            repository.deleteById(imageId);
            logger.info("Logo for the company with id {} deleted.", flatId);
        }
        throw new ResourceNotFoundException("No file found for flat with id " + flatId);
    }

    @Override
    public void deleteImagesForFlat(long flatId)
    {
        repository.deleteByFlatId(flatId);
    }

    @Override
    public void deleteRemovedImages(List<FlatImage> updatedImages, long flatId)
    {
        if (updatedImages.isEmpty())
            deleteImagesForFlat(flatId);
        else {
            var imageIds = updatedImages.stream().map(FlatImage::getId).collect(Collectors.toList());
            repository.deleteByFlatIdAndIdNotIn(flatId, imageIds);
        }
        logger.info(String.format("Removing ids no in %s", updatedImages.stream().map(FlatImage::getId).collect(joining(","))));
    }

}

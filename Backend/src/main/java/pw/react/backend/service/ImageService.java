package pw.react.backend.service;

import org.springframework.web.multipart.MultipartFile;
import pw.react.backend.model.FlatImage;

import java.util.List;
import java.util.Optional;

public interface ImageService
{
    List<FlatImage> storeImages(long flatId, List<MultipartFile> file);
    List<FlatImage> getFlatImages(long flatId);
    Optional<FlatImage> getFirstImage(long flatId);
    void deleteFlatImage(long flatId, String imageId);
    void deleteImagesForFlat(long flatId);
    void deleteRemovedImages(List<FlatImage> updatedImages, long flatId);
}

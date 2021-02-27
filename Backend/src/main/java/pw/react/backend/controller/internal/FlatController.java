package pw.react.backend.controller.internal;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pw.react.backend.appException.UnauthorizedException;
import pw.react.backend.dao.specifications.FlatSpecification;
import pw.react.backend.model.Flat;
import pw.react.backend.service.FlatsService;
import pw.react.backend.service.ImageService;
import pw.react.backend.service.general.SecurityProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.joining;


@RestController
@RequestMapping("/flats")
public class FlatController
{
    private final Logger logger = LoggerFactory.getLogger(FlatController.class);

    private final FlatsService flatsService;
    private final ImageService imageService;
    private final SecurityProvider securityService;

    @Autowired
    public FlatController(FlatsService flatsService, ImageService imageService, SecurityProvider securityService)
    {
        this.flatsService = flatsService;
        this.imageService = imageService;
        this.securityService = securityService;
    }

    private void logHeaders(@RequestHeader HttpHeaders headers) {
        logger.info("Controller request headers {}",
                headers.entrySet()
                        .stream()
                        .map(entry -> String.format("%s->[%s]", entry.getKey(), String.join(",", entry.getValue())))
                        .collect(joining(","))
        );

    }


    @GetMapping(path = "")
    public ResponseEntity<Page<Flat>> getFlats(@RequestHeader HttpHeaders headers,
                                               FlatSpecification flatSpecification,
                                               @PageableDefault(size = 10) Pageable pageable)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            return ResponseEntity.ok(flatsService.getFlats(flatSpecification, pageable));
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @PostMapping(path = "")
    public ResponseEntity<String> createFlat(@RequestHeader HttpHeaders headers,
                                             Flat flat,
                                             @RequestParam("new_images") List<MultipartFile> newImages)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers)) {
            Optional<Flat> result = flatsService.saveFlat(flat, newImages);
            if (result.isEmpty())
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save the flats");
            else
                return ResponseEntity.ok(Long.toString(result.get().getId()));
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @DeleteMapping(path = "/{flatId}")
    public ResponseEntity<String> deleteFlat(@RequestHeader HttpHeaders headers,
                                             @PathVariable Long flatId)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            boolean result = flatsService.deleteFlat(flatId);
            if (result)
                return ResponseEntity.ok(String.format("Flat with id %s deleted.", flatId));
            else
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("Flat with id %s not found.", flatId));
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @GetMapping(path = "/{flatId}")
    public ResponseEntity<Flat> getFlatDetails(@RequestHeader HttpHeaders headers,
                                               @PathVariable Long flatId)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            return flatsService.getFlat(flatId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Flat.Empty));
        }
        throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @PutMapping(path = "/{flatId}")
    public ResponseEntity<Flat> updateCompany(@RequestHeader HttpHeaders headers,
                                              @PathVariable Long flatId,
                                              Flat updatedFlat,
                                              @RequestParam("new_images") List<MultipartFile> newImages ) {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            if (updatedFlat.getImages() == null)
                updatedFlat.setImages(new ArrayList<>());
            Flat result = flatsService.updateFlat(flatId, updatedFlat, newImages);
            if (Flat.Empty.equals(result))
                return ResponseEntity.badRequest().body(result);
            return ResponseEntity.ok(result);
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @PostMapping(path = "/{flatId}/images")
    public ResponseEntity<String> uploadImages(@RequestHeader HttpHeaders headers,
                                              @PathVariable Long flatId,
                                              @RequestParam("images") List<MultipartFile> images)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            var addedImages = imageService.storeImages(flatId, images);
            return ResponseEntity.ok(String.format("Images uploaded: %s", addedImages.stream().map(c -> String.valueOf(c.getId())).collect(joining(","))));
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }

    @DeleteMapping(path = "/{flatId}/images/{imageId}")
    public ResponseEntity<String> deleteImage(@RequestHeader HttpHeaders headers,
                                              @PathVariable Long flatId,
                                              @PathVariable String imageId)
    {
        logHeaders(headers);
        if (securityService.isAuthorized(headers))
        {
            imageService.deleteFlatImage(flatId, imageId);
            return ResponseEntity.ok(String.format("Deleted image with id %s", imageId));
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }

}

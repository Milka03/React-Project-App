package pw.react.backend.controller.external;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;
import pw.react.backend.appException.UnauthorizedException;
import pw.react.backend.dao.specifications.BookingDatesSpecification;
import pw.react.backend.dao.specifications.FlatIDFilteringSpecification;
import pw.react.backend.dao.specifications.FlatSpecification;
import pw.react.backend.model.Flat;
import pw.react.backend.service.FlatsService;
import pw.react.backend.service.general.SecurityProvider;

import static java.util.stream.Collectors.joining;


@RestController
@RequestMapping("/ext/flats")
public class FlatExtController
{
    private final Logger logger = LoggerFactory.getLogger(FlatExtController.class);

    private final FlatsService flatsService;
    private final SecurityProvider securityService;

    @Autowired
    public FlatExtController(FlatsService flatsService, SecurityProvider securityService)
    {
        this.flatsService = flatsService;
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

    @GetMapping("")
    public RedirectView redirectWithUsingRedirectView(@RequestHeader HttpHeaders headers,
                                                      RedirectAttributes attributes,
                                                      @RequestParam(value = "apiKey", required = false) String apiKey,
                                                      @PageableDefault(size = 10) Pageable pageable,
                                                      BookingDatesSpecification bookingDatesSpecification,
                                                      FlatSpecification flatSpecification)
    {
        logHeaders(headers);
        if(securityService.isApiKeyValid(apiKey))
        {
            long[] ids = flatsService.getBookedFlatsIndexes(bookingDatesSpecification);
            attributes.addAttribute("bookedIds", ids);
            attributes.addAttribute("apiKey", apiKey);
            attributes.addFlashAttribute("spec", flatSpecification);
            attributes.addFlashAttribute("pageable", pageable);
            return new RedirectView("/ext/flats/free");
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }


    @GetMapping(path = "/free")
    public ResponseEntity<Page<Flat>> getFlats(@RequestParam(value = "apiKey", required = false) String apiKey,
                                               FlatIDFilteringSpecification flatSpecification,
                                               Model model)
    {
        var spec = (FlatSpecification)model.getAttribute("spec");
        var pageable = (Pageable)model.getAttribute("pageable");
        if(model.containsAttribute("spec"))
        {
            return ResponseEntity.ok(flatsService.getFlats(Specification.where(spec).and(flatSpecification), pageable));
        } else
            throw new UnauthorizedException("Unauthorized access to resources.");
    }


    @GetMapping(path = "/{flatId}")
    public ResponseEntity<Flat> getFlatDetails(@RequestHeader HttpHeaders headers,
                                               @RequestParam(value = "apiKey", required = false) String apiKey,
                                               @PathVariable Long flatId)
    {
        logHeaders(headers);
        if (securityService.isApiKeyValid(apiKey))
        {
            return flatsService.getFlat(flatId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Flat.Empty));
        }
        throw new UnauthorizedException("Unauthorized access to resources.");
    }
}

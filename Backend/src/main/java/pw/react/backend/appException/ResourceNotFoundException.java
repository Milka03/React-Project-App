package pw.react.backend.appException;

/** Created by Pawel Gawedzki on 06-Oct-2019. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

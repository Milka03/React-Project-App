package pw.react.backend.web;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class UploadFileResponse {
    private String fileName;
    private String fileDownloadUri;
    private String fileType;
    private long size;
}

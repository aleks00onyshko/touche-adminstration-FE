import { FileUpload } from '../../../../core/model/file-upload/file-upload.service';
import { FileExtractor } from '../../../../core/model/file-extractor/file-extract.service';
import { switchMap } from 'rxjs/operators';
import { firstValueFrom, map, take, tap } from 'rxjs';

import { Avatar } from './avatar';
import { AvatarConfiguration } from './avatar-configuration';

interface WithUpload {
  fileUploadImplementation: FileUpload;
  fileExtractorImplementation: FileExtractor;
  uploadFn: () => Promise<string>;
}

export abstract class AvatarWithFileUpload extends Avatar implements WithUpload {
  public uploadFn: () => Promise<string>;

  protected constructor(
    config: AvatarConfiguration,
    public fileUploadImplementation: FileUpload,
    public fileExtractorImplementation: FileExtractor
  ) {
    super(config);

    this.uploadFn = () =>
      firstValueFrom(
        this.fileExtractorImplementation.getFiles(true).pipe(
          switchMap(files => {
            return this.fileUploadImplementation.uploadFileToStorage(files[0]).pipe(
              map(downloadUrl => {
                // TODO: update corresponding User in firestore

                return downloadUrl as string;
              })
            );
          }),
          take(1)
        )
      );
  }
}

export class ToucheAvatarWithFileUpload extends AvatarWithFileUpload {
  constructor(
    config: AvatarConfiguration,
    fileUploadImplementation: FileUpload,
    fileExtractorImplementation: FileExtractor
  ) {
    super(config, fileUploadImplementation, fileExtractorImplementation);
  }
}

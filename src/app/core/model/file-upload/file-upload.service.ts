import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytesResumable } from '@firebase/storage';

export abstract class FileUpload {
  public abstract uploadFileToStorage(file: File): Observable<string | null>;
}

@Injectable()
export class ToucheFileUpload implements FileUpload {
  constructor(private storage: Storage) {}

  public uploadFileToStorage(file: File): Observable<string | null> {
    return new Observable(subj => {
      const storageRef = ref(this.storage, `${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', {
        complete: () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
            subj.next(downloadUrl);
            subj.complete();
          });
        },
        error: () => {
          subj.next(null);
          subj.complete();
        }
      });
    });
  }
}

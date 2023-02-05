import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytesResumable } from '@firebase/storage';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(@Inject(DOCUMENT) private document: Document, private storage: Storage) {}

  public uploadFileToStorage(file: File, shopId: string): Observable<string | null> {
    return new Observable(subj => {
      const storageRef = ref(this.storage, `${shopId}/${file.name}`);
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

  public getFiles(single?: boolean, supportedFileTypes?: string[]): Observable<File[]> {
    return new Observable(subj => {
      const fileInputElement: HTMLInputElement = this.createFileInputElement();

      if (!single) {
        fileInputElement.setAttribute('multiple', '');
      }

      if (supportedFileTypes) {
        fileInputElement.setAttribute('accept', supportedFileTypes.join(','));
      }

      fileInputElement.onchange = file => {
        const files = this.onFileChanged(file, fileInputElement);
        subj.next(files);
        subj.complete();
      };

      fileInputElement.click();
    });
  }

  private onFileChanged(event: any, fileInputElement: HTMLInputElement): File[] {
    this.document.body.removeChild(fileInputElement);

    if (!event.target.files) {
      return [];
    }

    return Object.values(event.target.files);
  }

  private createFileInputElement(): HTMLInputElement {
    const input = this.document.createElement('input');

    input.setAttribute('type', 'file');
    input.style.display = 'none';
    this.document.body.append(input);

    return input;
  }
}

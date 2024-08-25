import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export abstract class FileExtractor {
  public abstract getFiles(single?: boolean, supportedFileTypes?: string[]): Observable<File[]>;
}

@Injectable()
export class ToucheFileExtractor implements FileExtractor {
  constructor(@Inject(DOCUMENT) private document: Document) {}

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

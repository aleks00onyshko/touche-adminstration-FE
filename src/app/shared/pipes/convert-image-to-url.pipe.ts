import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertImageToUrl',
  standalone: true
})
export class ConvertImageToUrlPipe implements PipeTransform {
  public transform(image: File): string {
    return URL.createObjectURL(image);
  }
}

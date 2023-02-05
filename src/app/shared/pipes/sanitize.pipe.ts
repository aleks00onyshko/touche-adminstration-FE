import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';

@Pipe({
  name: 'sanitize',
  standalone: true
})
export class SanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform(imageUrl: string): any {
    return unwrapSafeValue(this.sanitizer.bypassSecurityTrustStyle(imageUrl));
  }
}

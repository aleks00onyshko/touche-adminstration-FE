import { Injectable } from '@angular/core';

import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class UUIDGeneratorService {
  public generateId(): string {
    return uuid();
  }
}

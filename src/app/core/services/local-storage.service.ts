import { Injectable } from '@angular/core';

export type LocalStorageKeys = 'location' | 'language';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly TOUCHE_LOCALSTORAGE_KEY = 'TOUCHE';
  constructor() {}

  public set(key: LocalStorageKeys, value: any): void {
    localStorage.setItem(`${this.TOUCHE_LOCALSTORAGE_KEY}-${key}`, value);
  }

  public get<T>(key: LocalStorageKeys): T {
    return localStorage.getItem(`${this.TOUCHE_LOCALSTORAGE_KEY}-${key}`) as T;
  }
}

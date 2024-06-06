import { Injectable } from '@angular/core';

export type LocalStorageKeys = 'location' | 'language' | 'theme';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  public static readonly TOUCHE_LOCALSTORAGE_KEY = 'TOUCHE';
  constructor() {}

  public set(key: LocalStorageKeys, value: any): void {
    localStorage.setItem(`${LocalStorageService.TOUCHE_LOCALSTORAGE_KEY}-${key}`, value);
  }

  public get<T>(key: LocalStorageKeys): T | undefined {
    return localStorage.getItem(LocalStorageService.TOUCHE_LOCALSTORAGE_KEY + '-' + key) as T;
  }
}

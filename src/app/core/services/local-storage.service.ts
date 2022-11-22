import { Injectable } from '@angular/core';

export type LocalStorageKeys = 'lastVisitedShopId';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor() {}

  public set(key: LocalStorageKeys, value: any): void {
    localStorage.setItem(key, value);
  }

  public get<T>(key: LocalStorageKeys): T {
    return localStorage.getItem(key) as T;
  }
}

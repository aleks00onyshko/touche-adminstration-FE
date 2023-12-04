import { Entity } from './entity';

export interface Location extends Entity<string> {
  displayNames: {
    en: string;
    uk: string;
  };
}

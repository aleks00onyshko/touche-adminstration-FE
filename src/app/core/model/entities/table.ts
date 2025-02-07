import { Entity } from './entity';

export interface Table extends Entity<string> {
  name: string;
  capacity: number;
}

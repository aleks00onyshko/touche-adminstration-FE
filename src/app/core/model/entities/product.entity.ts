import { Entity } from './entity';

export interface Product extends Entity {
  name: string;
  description: string;
  price: number;
  image: string;
}

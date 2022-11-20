import { Entity } from './entity';
import { Product } from './product.entity';

export interface Category extends Entity {
  name: string;
  products: Product[];
}

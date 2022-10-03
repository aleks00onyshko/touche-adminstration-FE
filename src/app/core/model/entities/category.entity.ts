import { Product } from './product.entity';

export interface Category {
  name: string;
  products: Product[];
}

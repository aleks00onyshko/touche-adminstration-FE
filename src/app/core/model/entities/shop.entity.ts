import { Category } from './category.entity';
import { Entity } from './entity';

export interface Shop extends Entity {
  name: string;
  botToken: string;
  categories: Category[];
}

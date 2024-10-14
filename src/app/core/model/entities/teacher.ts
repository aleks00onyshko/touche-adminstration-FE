import { User } from './user';

export interface Teacher extends User {
  description: string;
  number: string;
}

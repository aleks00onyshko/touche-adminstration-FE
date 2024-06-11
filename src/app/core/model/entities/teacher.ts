import { User } from './user';

export interface Teacher extends User {
    imageUrl: string;
    description: string;
    number: string;
    subjects: string;
}

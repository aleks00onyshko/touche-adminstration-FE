import { UserInfo } from '@angular/fire/auth';
import { Entity } from './entity';

export interface User extends Entity<string>, Pick<UserInfo, 'displayName' | 'email' | 'uid'> {
    backgroundImageUrl: string;
}

import { PassportSerializer } from '@nestjs/passport';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { User } from '../../../user/entities/user.entity';

export class UserSerializer extends PassportSerializer {
  serializeUser(
    user: User,
    done: (err: Error, user: ActiveUserData) => void,
  ): void {
    done(null, {
      substring: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  }

  async deserializeUser(
    payload: ActiveUserData,
    done: (err: Error, user: ActiveUserData) => void,
  ): Promise<void> {
    done(null, payload);
  }
}

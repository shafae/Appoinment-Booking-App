import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/model/user.model';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

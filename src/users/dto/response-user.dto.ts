import { FindOptionsSelect } from 'typeorm';
import { User } from '../entities/user.entity';

export const ResponseUserDto: FindOptionsSelect<User> = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  profilePicture: true,
  isActive: true,
  isEmailVerified: true,
  isSuperAdmin: true,
  isAllowedToCreateCourse: true,
  createdAt: true,
  updatedAt: true,
};

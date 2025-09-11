import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isSuperAdmin: boolean;

  @IsBoolean()
  isAllowedToCreateCourse: boolean;

  @IsOptional()
  profilePicture?: string;
}

import { IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class SignUpDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

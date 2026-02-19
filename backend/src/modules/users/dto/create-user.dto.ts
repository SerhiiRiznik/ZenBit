import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { STRICT_EMAIL_PATTERN } from '../../../common/validation/email-pattern';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  @Matches(STRICT_EMAIL_PATTERN, {
    message: 'Please provide a valid email address',
  })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

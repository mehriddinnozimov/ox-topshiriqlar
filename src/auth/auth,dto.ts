import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { OTP_LENGTH } from 'src/constants';

export class LoginDTO {
  @IsString()
  @IsEmail()
  email: string;
}

export class VerifyDTO {
  @IsString()
  @MinLength(OTP_LENGTH)
  @MaxLength(OTP_LENGTH)
  otp: string;

  @IsString()
  ots: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { OTP_LENGTH } from 'src/constants';

export class LoginDTO {
  @IsString()
  @IsEmail()
  @ApiProperty({ default: 'mehriddin0507@gmail.com' })
  email: string;
}

export class VerifyDTO {
  @IsString()
  @MinLength(OTP_LENGTH)
  @MaxLength(OTP_LENGTH)
  @ApiProperty()
  otp: string;

  @IsString()
  @ApiProperty()
  ots: string;
}

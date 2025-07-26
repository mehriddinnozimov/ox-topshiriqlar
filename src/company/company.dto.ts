import { IsString } from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  subdomain: string;

  @IsString()
  token: string;
}

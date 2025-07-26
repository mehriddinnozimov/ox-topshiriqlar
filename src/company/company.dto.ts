import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  @ApiProperty()
  subdomain: string;

  @IsString()
  @ApiProperty()
  token: string;
}

export class GetProductsDTO {
  @IsNumber()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ default: 1 })
  page: number;

  @IsNumber()
  @IsInt()
  @Max(40)
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ default: 10 })
  size: number;
}

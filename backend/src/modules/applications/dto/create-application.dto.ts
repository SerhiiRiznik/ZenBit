import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  assetType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  priceAmount: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ticketAmount: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  offersAmount: number;

  @IsDateString()
  validTo: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  currencyCode: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  yieldPercent: number;
}

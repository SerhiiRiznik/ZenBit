import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationInvestmentStatus } from '../entities/application-investment.entity';

export class UpdateApplicationInvestmentDto {
  @IsOptional()
  @IsEnum(ApplicationInvestmentStatus)
  status?: ApplicationInvestmentStatus;
}

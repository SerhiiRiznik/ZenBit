import { IsEnum, IsInt, Min } from 'class-validator';
import { ApplicationInvestmentStatus } from '../entities/application-investment.entity';

export class CreateApplicationInvestmentDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsEnum(ApplicationInvestmentStatus)
  status: ApplicationInvestmentStatus;
}

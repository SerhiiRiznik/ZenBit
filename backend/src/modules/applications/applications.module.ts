import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationEntity } from './entities/application.entity';
import { CurrencyEntity } from './entities/currency.entity';
import { ApplicationInvestmentEntity } from './entities/application-investment.entity';
import { UsersModule } from '../users/users.module';
import { ApplicationImagesStorageService } from './application-images-storage.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ApplicationEntity,
      CurrencyEntity,
      ApplicationInvestmentEntity,
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationImagesStorageService],
})
export class ApplicationsModule {}

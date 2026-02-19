import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from '../modules/applications/entities/application.entity';
import { ApplicationInvestmentEntity } from '../modules/applications/entities/application-investment.entity';
import { CurrencyEntity } from '../modules/applications/entities/currency.entity';
import { UserEntity } from '../modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const sslEnabled =
          configService.get<string>('DB_SSL', 'true') === 'true';
        const host = configService.get<string>('POSTGRES_HOST');
        const port = Number(configService.get<string>('POSTGRES_PORT', '5432'));
        const username = configService.get<string>('POSTGRES_USER');
        const password = configService.get<string>('POSTGRES_PASSWORD');
        const database = configService.get<string>('POSTGRES_DB');

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          entities: [
            UserEntity,
            ApplicationEntity,
            CurrencyEntity,
            ApplicationInvestmentEntity,
          ],
          synchronize: false,
          migrations: ['dist/migrations/*{.js,.ts}'],
          migrationsRun:
            configService.get<string>('DB_MIGRATIONS_RUN', 'false') === 'true',
        };
      },
    }),
  ],
})
export class DatabaseModule {}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CurrencyEntity } from './currency.entity';
import { ApplicationInvestmentEntity } from './application-investment.entity';

@Entity({ name: 'applications' })
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 160 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'int' })
  priceAmount: number;

  @Column({ type: 'int' })
  ticketAmount: number;

  @Column({ type: 'int' })
  offersAmount: number;

  @Column({ type: 'real' })
  yieldPercent: number;

  @ManyToOne(() => CurrencyEntity, { eager: true, nullable: false })
  currency: CurrencyEntity;

  @OneToMany(
    () => ApplicationInvestmentEntity,
    (investment) => investment.application,
  )
  investments: ApplicationInvestmentEntity[];

  @Column({ type: 'date' })
  validTo: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

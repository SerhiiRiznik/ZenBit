import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { UserEntity } from '../../users/entities/user.entity';

export enum ApplicationInvestmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity({ name: 'application_investments' })
export class ApplicationInvestmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ApplicationEntity,
    (application) => application.investments,
    {
      onDelete: 'CASCADE',
    },
  )
  application: ApplicationEntity;

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ApplicationInvestmentStatus,
    default: ApplicationInvestmentStatus.PENDING,
  })
  status: ApplicationInvestmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const entity = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(entity);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.usersRepository.update({ id: userId }, { refreshTokenHash });
  }

  sanitizeUser(user: UserEntity) {
    const { password, refreshTokenHash, ...safeUser } = user;
    return safeUser;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}

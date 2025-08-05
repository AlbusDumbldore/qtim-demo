import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: User['email']): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: User['id']): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }
}

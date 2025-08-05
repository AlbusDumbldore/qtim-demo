import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @CreateDateColumn({ type: 'timestamp' })
  public created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updated: Date;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @CreateDateColumn({ type: 'timestamp' })
  public created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updated: Date;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}

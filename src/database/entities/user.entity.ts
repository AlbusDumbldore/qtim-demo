import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Column()
  public email: string;

  @Column()
  public password: string;
}

import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  @IsNotEmpty()
  @IsString()
  role: string;

  @AutoMap()
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  constructor(role: string) {
    this.role = role;
  }
}

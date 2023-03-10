import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  password: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  username: string;

  @Column({ nullable: true })
  @IsString()
  @AutoMap()
  biography: string;

  @Column({ nullable: true })
  @AutoMap()
  refreshToken: string;

  @AutoMap()
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn()
  role: Role;

  @AutoMap()
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  constructor(
    email: string,
    password: string,
    username: string,
    biography: string,
    role: Role,
  ) {
    this.email = email;
    this.password = password;
    this.username = username;
    this.biography = biography;
    this.role = role;
  }
}

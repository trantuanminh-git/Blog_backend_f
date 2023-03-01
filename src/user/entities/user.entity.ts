import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column('text')
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
  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  @AutoMap()
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @AutoMap()
  @OneToMany(() => Rating, (rating : Rating) => rating.userId, {cascade: true})
  ratings: Rating[];

  @AutoMap()
  @OneToMany(() => Notification, (notification : Notification) => notification.userId, {cascade: true})
  notifications: Notification[];

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

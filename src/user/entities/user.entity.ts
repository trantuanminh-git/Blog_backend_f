import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { Likes } from 'src/like/entities/like.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Role } from 'src/role/entities/role.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({
    default:
      'https://cambodiaict.net/wp-content/uploads/2019/12/computer-icons-user-profile-google-account-photos-icon-account.jpg',
    length: 200,
  })
  @IsString()
  @AutoMap()
  avatarUrl: string;

  @Column({ nullable: true })
  @AutoMap()
  refreshToken: string;

  @Column()
  roleId: number;

  @AutoMap()
  @ManyToOne(() => Role, (role) => role.users, { cascade: true })
  role: Role;

  @AutoMap()
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @AutoMap()
  @OneToMany(() => Likes, (like) => like.user)
  likes: Likes[];

  @AutoMap()
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @OneToMany(() => Rating, (rating: Rating) => rating.userId, { cascade: true })
  ratings: Rating[];

  @AutoMap()
  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.userId,
    { cascade: true },
  )
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

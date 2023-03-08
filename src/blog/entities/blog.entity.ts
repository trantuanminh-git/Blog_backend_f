import { IsNotEmpty, IsString } from 'class-validator';
import { Notification } from 'src/notification/entities/notification.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @CreateDateColumn() // You don't need to set this column - it will be automatically set
  created_at: Date; // Creation date

  @UpdateDateColumn() // You don't need to set this column - it will be automatically set
  updated_at: Date; // Last updated date

  @Column({ default: 0 })
  view: number;

  @Column()
  userId: number

  @Column()
  averageRating: number;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Rating, (rating : Rating) => rating.blog, {cascade: true})
  ratings: Rating[];

  @OneToMany(() => Notification, (notification : Notification) => notification.blog, {cascade: true})
  notifications: Notification[];

  constructor(title: string, content: string, tags: Tag[], user: User) {
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.user = user;
  }
}

import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  RATING = 'rating',
}

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: NotificationType;

  @Column()
  content: string;

  @Column()
  isRead: boolean;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  updatedAt: Date;

  @Column('int')
  userId: number;

  @ManyToOne(() => User, (user: User) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;

  @Column('int')
  blogId: number;

  @ManyToOne(() => Blog, (blog: Blog) => blog.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'blogId',
    referencedColumnName: 'id',
  })
  blog: Blog;

  constructor(type: NotificationType, content, createdAt, userId, blogId) {
    this.type = type;
    this.content = content;
    this.createdAt = createdAt;
    this.userId = userId;
    this.blogId = blogId;
  }
}

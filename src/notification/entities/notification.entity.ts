import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  RATING = 'rating',
  CREATE = 'create'
}

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: NotificationType;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  }) // You don't need to set this column - it will be automatically set
  createdAt: Date; // Creation date

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  }) // You don't need to set this column - it will be automatically set
  updatedAt: Date; // Last updated date

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

  constructor(type: NotificationType, userName: string, userId: number, blogId: number) {
    let content = "";
    switch(type) { 
      case 'rating': { 
        content = `${userName} ${type}d on your blog.`;
        break; 
      } 
      case 'like': { 
        content = `${userName} ${type}s your blog.`; 
        break; 
      } 
      case 'comment': { 
        content = `${userName} ${type}ed on your blog.`; 
        break; 
      } 
      case 'create': { 
        content = `${userName} ${type}d new blog.`; 
        break; 
      } 
      default: { 
        break; 
      } 
    } 
    this.type = type;
    this.content = content;
    this.userId = userId;
    this.blogId = blogId;
  }
}

import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('like')
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @ManyToOne('User', (user: User) => user.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column('int')
  blogId: number;

  @ManyToOne('User', (blog: Blog) => blog.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: Blog;
}

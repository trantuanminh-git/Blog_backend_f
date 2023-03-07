import { AutoMap } from '@automapper/classes';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('likes')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column('datetime')
  created_at: Date;

  @Column('datetime')
  updated_at: Date;

  @Column('int')
  userId: number;

  @ManyToOne('User', (user: User) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column('int')
  blogId: number;

  @ManyToOne('Comment', (comment: Comment) => comment.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  comment: Comment;

  @AutoMap()
  @OneToMany(() => Comment, (comment) => comment.comment)
  comments: Comment[];

  @ManyToOne('Blog', (blog: Blog) => blog.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  blog: Blog;

  @Column('int')
  parentId: number;
}

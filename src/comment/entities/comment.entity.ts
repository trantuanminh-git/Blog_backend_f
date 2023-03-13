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
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

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

  @ManyToOne('User', (user: User) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column('int')
  blogId: number;

  @ManyToOne('Comment', (comment: Comment) => comment.childComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parentComment: Comment;

  @AutoMap()
  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Comment[];

  @ManyToOne('Blog', (blog: Blog) => blog.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: Blog;

  @Column({ nullable: true })
  parentId: number;
}

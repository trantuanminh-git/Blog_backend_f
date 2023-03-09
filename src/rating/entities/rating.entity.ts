import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  star: number;

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

  @ManyToOne(() => User, (user: User) => user.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column('int')
  blogId: number;

  @ManyToOne(() => Blog, (blog: Blog) => blog.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  constructor(star: number, userId: number, blogId: number) {
    this.star = star;
    this.userId = userId;
    this.blogId = blogId;
  }
}

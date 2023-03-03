import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  star: number

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date

  @Column('int')
  userId: number

  @ManyToOne(() => User, (user: User) => user.ratings, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "id" })
  user: User;

  @Column('int')
  blogId: number

  @ManyToOne(() => Blog, ( blog: Blog) =>  blog.ratings, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "id" })
  blog: Blog;

  constructor(
    star: number,
    createdAt: Date,
    userId: number,
    blogId: number
    ) {
    this.star = star
    this.createdAt = createdAt
    this.userId = userId
    this.blogId = blogId
  }
}
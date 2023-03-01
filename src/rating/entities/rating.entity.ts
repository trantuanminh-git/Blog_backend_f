import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  star: Number

  @Column('datetime')
  created_at: Date

  @Column('datetime')
  updated_at: Date

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
}
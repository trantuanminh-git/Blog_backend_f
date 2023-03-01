import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: Text

  @Column()
  content: Text

  @Column()
  is_read: boolean

  @Column('datetime')
  created_at: Date

  @Column('datetime')
  updated_at: Date

  @Column('int')
  userId: number

  @ManyToOne(() => User, (user: User) => user.notifications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "id" })
  user: User;


  @Column('int')
  blogId: number

  @ManyToOne(() => Blog, ( blog: Blog) =>  blog.notifications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "id" })
  blog: Blog;
}
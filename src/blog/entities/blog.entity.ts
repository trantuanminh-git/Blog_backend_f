import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';
import { Likes } from 'src/like/entities/like.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Column()
  @IsString()
  imageUrl: string;

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

  @Column({ default: 0 })
  view: number;

  @Column()
  @IsNotEmpty()
  userId: number;

  @Column({ type: 'float', nullable: true })
  averageRating: number;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable()
  tags: Tag[];

  @AutoMap()
  @OneToMany(() => Likes, (like) => like.blog, { cascade: true })
  likes: Likes[];

  @Column({ default: 0 })
  likeCount: number;

  @AutoMap()
  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];

  @Column({ default: 0 })
  cmtCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @OneToMany(() => Rating, (rating: Rating) => rating.blog, { cascade: true })
  ratings: Rating[];

  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.blog,
    { cascade: true },
  )
  notifications: Notification[];

  constructor(title: string, content: string,imageUrl: string, tags: Tag[], user: User) {
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.user = user;
    this.imageUrl = imageUrl;
  }
}

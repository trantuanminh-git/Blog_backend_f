import { IsNotEmpty, IsString } from 'class-validator';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @CreateDateColumn() // You don't need to set this column - it will be automatically set
  created_at: Date; // Creation date

  @UpdateDateColumn() // You don't need to set this column - it will be automatically set
  updated_at: Date; // Last updated date

  @Column({ default: 0 })
  view: number;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable()
  tags: Tag[];

  constructor(title: string, content: string, tags: Tag[], user: User) {
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.user = user;
  }
}

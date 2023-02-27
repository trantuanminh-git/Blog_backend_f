import { IsNotEmpty, IsString } from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  tag: string;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs: Blog[];

  constructor(tagName: string) {
    this.tag = tagName;
  }
}

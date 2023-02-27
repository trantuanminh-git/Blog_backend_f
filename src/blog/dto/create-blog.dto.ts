import { IsNotEmpty } from 'class-validator';
import { Tag } from 'src/tag/entities/tag.entity';

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  userId: number;

  tags: string[];
}

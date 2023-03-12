import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  blogId: number;

  parentId?: number;

  @IsNotEmpty()
  content: string;
}

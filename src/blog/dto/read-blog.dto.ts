import { PartialType } from '@nestjs/mapped-types';
import { Likes } from 'src/like/entities/like.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';

export class ReadBlogDto {
  id: number;

  title: string;

  content: string;

  imageUrl: string;

  createdAt: Date;

  updatedAt: Date;

  view: number;

  userId: number;

  averageRating: number;

  user: User;

  tags: Tag[];

  likes: Likes[];

  likeCount: number;

  comments: Comment[];

  cmtCount: number;

  shareCount: number;

  ratings: Rating[];

  Liked: boolean;
}

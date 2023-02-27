import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  tag: string;
}

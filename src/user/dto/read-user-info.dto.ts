import { AutoMap } from '@automapper/classes';
import { Blog } from 'src/blog/entities/blog.entity';
import { Role } from 'src/role/entities/role.entity';
import { Entity } from 'typeorm';

@Entity()
export class ReadUserInfoDto {
  @AutoMap()
  id: number;

  @AutoMap()
  email: string;

  @AutoMap()
  username: string;

  password;

  @AutoMap()
  biography: string;

  @AutoMap()
  avatarUrl: string;

  @AutoMap()
  role: Role;

  // @AutoMap()
  socialId: string;

  // @AutoMap()
  social: string;

  @AutoMap()
  blogs: Blog[];
}

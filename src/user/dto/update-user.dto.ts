import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from 'src/role/entities/role.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email: string;
  username: string;
  password: string;
  biography: string;
  role: Role;
}

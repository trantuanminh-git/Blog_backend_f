import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  role: Role;

  biography: string;
}

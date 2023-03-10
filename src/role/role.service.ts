import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { role } = createRoleDto;
    const roleExisted = await this.roleRepository.findOne({
      where: { role: role },
    });

    if (roleExisted) {
      const errors = { tag: 'Tag must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    // create new tag
    const newRole = await this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(newRole);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne({ where: { id: id } });
  }

  async findOneByRole(role: string) {
    return await this.roleRepository.findOne({ where: { role: role } });
    // if role is undefined -> return 'admin'????? -> WE DONT NEED THIS (BUG OR FEATURE?????)
    // if role is '' -> not founded Role -> return null -> WE NEED THIS
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

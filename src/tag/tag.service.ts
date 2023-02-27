import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { tag } = createTagDto;
    const tagExist = await this.tagRepository.findOne({ where: { tag: tag } });

    if (tagExist) {
      const errors = { tag: 'Tag must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    // create new tag
    const newTag = await this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOneById(id: number): Promise<Tag> {
    return await this.tagRepository.findOne({ where: { id: id } });
  }

  async findOneByTagName(tagName: string): Promise<Tag> {
    return await this.tagRepository.findOne({ where: { tag: tagName } });
  }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  async remove(id: number): Promise<Tag[]> {
    const tag = await this.tagRepository.find({ where: { id } });
    return this.tagRepository.remove(tag);
  }
}

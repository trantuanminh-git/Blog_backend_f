import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.tagService.findOneById(+id);
  }

  @Get('tagName/:tagName')
  findOneByTagName(@Param('tagName') tagName: string) {
    return this.tagService.findOneByTagName(tagName);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagService.update(+id, updateTagDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tag[]> {
    return this.tagService.remove(+id);
  }
}

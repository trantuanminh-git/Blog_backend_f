import { AwsService } from './aws.service';

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AtGuard } from 'src/common/guards/at.guard';

@Controller()
export class AWSController {
  constructor(private readonly awsService: AwsService) {}

  @UseGuards(AtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.awsService.fileUpload(file);
  }
}

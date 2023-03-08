import { CacheModule, Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TagModule } from 'src/tag/tag.module';
import { AbilityModule } from 'src/ability/ability.module';
import { RatingModule } from 'src/rating/rating.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    UserModule,
    TagModule,
    AbilityModule,
    CacheModule.register(),
    RatingModule
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [TypeOrmModule],
})
export class BlogModule {}

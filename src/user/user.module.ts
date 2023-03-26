import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from '../profile/user.profile';
import { RoleModule } from 'src/role/role.module';
import { AbilityModule } from 'src/ability/ability.module';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    AbilityModule,
    AwsModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProfile],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}

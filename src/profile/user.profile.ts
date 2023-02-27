import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ReadUserInfoDto } from '../user/dto/read-user-info.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        User,
        ReadUserInfoDto,
        forMember(
          (dest: User) => dest.blogs,
          mapFrom((d) => d.blogs),
          // ignore(),
        ),
      );
    };
  }
}

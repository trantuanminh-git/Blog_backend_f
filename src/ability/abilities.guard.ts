import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { CHECK_ABILITY, RequiredRule } from './abilities.decorator';
import { AbilityFactory } from './ability.factory/ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    // console.log(rules);
    const requestt = context.switchToHttp().getRequest();
    // const currUser = GetCurrentUser();
    console.log('>>>>>>>>>>>currUser');
    console.log(requestt.user);

    const user1: User = {
      id: 40,
      email: 'email2@gmail.com',
      username: 'minhtran2',
      biography: 'mybio2',
      role: new Role('blogger'),
      password: 'abc',
      refreshToken: 'abc',
      blogs: [],
    };
    const ability = this.caslAbilityFactory.defineAbility(user1);
    // console.log(ability);

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }
}

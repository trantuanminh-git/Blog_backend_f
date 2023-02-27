import {
  AbilityBuilder,
  AbilityClass,
  buildMongoQueryMatcher,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { $ne, ne } from '@ucast/mongo2js';
import { Blog } from 'src/blog/entities/blog.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

// the main file where we define the user's rules and permissions

const conditionsMatcher = buildMongoQueryMatcher({ $ne }, { ne });

export enum Action {
  Manage = 'manage', // wildcard for any action, 'manage' is a special keyword in CASL which represents "any" action.
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// export type Subjects = InferSubjects<typeof User> | 'all'; // 'all' is wildcard for any subject
export type Subjects = InferSubjects<typeof Blog | typeof User> | 'all'; // 'all' is wildcard for any subject

// join the Action and Subject together to define the overall type of our casl ability
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    // define rules
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.role.role == new Role('admin').role) {
      // can(Action.Manage, User); -> admin can do anything with User entity
      can(Action.Manage, 'all'); //with "PureAbility as AbilityClass<AppAbility>", we can bind the first argument with the AppAbility
    } else if (user.role.role == new Role('blogger').role) {
      can(Action.Manage, 'all').because('you are special');
      cannot(Action.Update, User, { id: { $ne: user.id } }).because(
        'you just can update your information',
      );
      cannot(Action.Delete, User).because("you just can't delete");
      cannot(Action.Manage, Blog, { userId: { $ne: user.id } }).because(
        'you just can CRUD your blog!',
      );
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher,
    });
    // if it see an object, it will look at the object's constructor and figure out what is the subject we trying to talk about
  }
}

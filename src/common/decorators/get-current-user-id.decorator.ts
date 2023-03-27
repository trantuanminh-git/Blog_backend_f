import { nullSubstitution } from '@automapper/core';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return null;
    return request.user['user_ID']; // get the id of user
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    return request.user['user_ID']; // get the id of user
  },
);

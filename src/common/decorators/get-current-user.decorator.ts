import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (!data) return request.user;
    console.log(request.user);
    return request.user?.[`${data}`];
  },
);

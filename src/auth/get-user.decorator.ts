import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user?: Record<string, any> }>();
  if (!request.user) {
    throw new UnauthorizedException('Unauthorized access: User not found');
  }
  return request.user;
});

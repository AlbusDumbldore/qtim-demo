import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedFastifyRequest } from '../modules/auth/auth.types';

export const AuthorizedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthorizedFastifyRequest['user'] => {
    const request = ctx.switchToHttp().getRequest<AuthorizedFastifyRequest>();

    return request.user;
  },
);

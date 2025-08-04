import { FastifyRequest } from 'fastify';
import { User } from '../../database/entities/user.entity';

export type JwtPayload = {
  id: User['id'];
  email: User['email'];
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthorizedFastifyRequest = FastifyRequest & {
  user: User;
};

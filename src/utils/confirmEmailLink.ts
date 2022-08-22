import { v4 } from 'uuid';
import { redis } from '../redis';

export const confirmEmailLink = async (userId: string) => {
  const id = v4();

  await redis.set(`confirmEmail:${id}`, userId, 'EX', 60 * 60 * 24);

  return `${process.env.BACKEND_HOST}/auth/confirm/${id}`;
};

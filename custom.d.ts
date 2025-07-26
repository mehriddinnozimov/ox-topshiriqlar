import { PrismaClient } from '@prisma/client';

declare global {
  type PrismaTransaction = Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >;
}

declare module 'express' {
  interface Request {
    user: UserTokenInfo;
  }
}

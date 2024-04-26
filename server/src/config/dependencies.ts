import { PrismaClient } from '@prisma/client';

export type Dependecies = {
  prisma: InstanceType<typeof PrismaClient>;
};

export function bootstrapDependecies(): Dependecies {
  const prisma = new PrismaClient();

  return {
    prisma,
  };
}

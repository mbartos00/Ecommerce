import { PrismaClient } from '@prisma/client';

export type Dependecies = {
  prisma: InstanceType<typeof PrismaClient>;
};

export async function bootstrapDependecies(): Promise<Dependecies> {
  const prisma = new PrismaClient();

  return {
    prisma,
  };
}

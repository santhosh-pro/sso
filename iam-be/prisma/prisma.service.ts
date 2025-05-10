import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getExtendedPrismaClient } from './extended/extend';
import { prismaClient } from './prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prismaClient.$connect();
  }

  async onModuleDestroy() {
    await prismaClient.$disconnect();
  }

  async client<T>(
    callback: (tx: {
      dbContext: ReturnType<typeof getExtendedPrismaClient>;
    }) => Promise<T>,
    options: { isTransaction?: boolean; isCompanyFilter?: boolean } = {},
  ): Promise<T> {
    const { isTransaction = true, isCompanyFilter = true } = options;

    if (isTransaction) {
      try {
        console.log('Starting transaction...');
        const result = await prismaClient.$transaction(
          async (prismaTx) => {
            const tx = getExtendedPrismaClient(prismaTx, isCompanyFilter);

            return await callback({ dbContext: tx });
          },
          {
            timeout: 120000,
          },
        );
        console.log('Transaction completed successfully.');
        return result;
      } catch (error) {
        console.error('Transaction rolled back due to an error:', error);
        throw error;
      }
    } else {
      console.log('Executing non-transactional operation...');
      const tx = getExtendedPrismaClient(prismaClient, isCompanyFilter);

      return await callback({ dbContext: tx });
    }
  }
}

import { PrismaClient } from '@prisma/client';
import { userSeeds } from './data/users-seed';
import { clientSeeds } from './data/client-seed';
import { redirectUrlSeeds } from './data/redirect-ulr-seed';

const prisma = new PrismaClient();

async function upsertItem(model: string, data: any) {
  await (prisma as any)[model].upsert({
    where: { id: data.id },
    update: data,
    create: data,
  });
}

async function seedModel(
  model: string,
  rows: any[],
  operationType: 'upsertItem' | 'createMany' = 'upsertItem',
) {
  if (operationType === 'upsertItem') {
    for (const item of rows) {
      await upsertItem(model, item);
    }
    return;
  }

  if (operationType === 'createMany') {
    await prisma[model].createMany({
      data: rows,
      skipDuplicates: true,
    });
  }
}

async function main() {
  try {
    await seedModel('user', userSeeds);
    await seedModel('client', clientSeeds);
    await seedModel('redirectURL', redirectUrlSeeds);
    console.log('Seed data created or updated successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().then();

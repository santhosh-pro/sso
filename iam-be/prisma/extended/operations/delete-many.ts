import { PrismaClient } from '@prisma/client';
import { setAuditLog } from '../audit';

export async function handleDeleteMany(
  prismaTx: PrismaClient,
  args: any,
  model: string,
  userId: string,
) {
  if (Array.isArray(args.where)) {
    args.where = args.where.map((whereItem: any) => ({ ...whereItem }));
  } else {
    args.where = { ...args.where };
  }

  const recordsToDelete = await prismaTx[model].findMany({
    where: args.where,
  });

  await Promise.all(
    recordsToDelete.map(async (record: any) => {
      await setAuditLog(
        'deleteMany',
        'delete',
        model,
        record.id,
        record,
        null,
        userId,
        prismaTx,
      );
    }),
  );

  const deletedRecords = await prismaTx[model].deleteMany(args);

  return deletedRecords;
}

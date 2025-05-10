import { PrismaClient } from '@prisma/client';
import { setAuditLog } from '../audit';

export async function handleDelete(
  prismaTx: PrismaClient,
  args: any,
  model: string,
  userId: string,
) {
  args.data = { ...args.data };

  const oldValue = await prismaTx[model].findUnique({ where: args.where });
  args.data = oldValue;

  await setAuditLog(
    'delete',
    'hardDelete',
    model,
    args.where.id,
    oldValue,
    null,
    userId,
    prismaTx,
  );

  const deletedRecord = await prismaTx[model].delete({
    where: args.where,
  });

  return deletedRecord;
}

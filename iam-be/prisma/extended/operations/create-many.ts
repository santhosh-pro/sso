import { PrismaClient } from '@prisma/client';
import { setAuditFields, setAuditLog } from '../audit';

export async function handleCreateMany(
  prismaTx: PrismaClient,
  args: any,
  model: string,
  userId: string,
) {
  if (Array.isArray(args.data)) {
    args.data = args.data.map((dataItem: any) => ({ ...dataItem }));
  } else {
    args.data = { ...args.data };
  }

  await setAuditFields('create', args);

  const newValues = await prismaTx[model].createMany(args);
  const valuesToProcess = Array.isArray(newValues) ? newValues : [];

  await Promise.all(
    valuesToProcess.map(async (newValue: any) => {
      await setAuditLog(
        'createMany',
        'create',
        model,
        newValue.id,
        null,
        newValue,
        userId,
        prismaTx,
      );
    }),
  );

  return newValues;
}

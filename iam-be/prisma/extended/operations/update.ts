import { PrismaClient } from '@prisma/client';
import { setAuditFields, setAuditLog } from '../audit';
import { deepEqual } from '../helper';

export async function handleUpdate(
  prismaTx: PrismaClient,
  args: any,
  model: string,
  userId: string,
) {
  args.data = { ...args.data };

  if (prismaTx) {
    await setAuditFields('update', args);

    const oldValue = await prismaTx[model].findFirst({ where: args.where });

    if (!oldValue) {
      throw new Error(`Record not found for ${model}`);
    }

    const newData = args.data;
    const changedFields = Object.keys(newData).reduce((acc, key) => {
      const oldVal = oldValue[key];
      const newVal = newData[key];

      if (oldVal instanceof Date && newVal instanceof Date) {
        if (oldVal.getTime() !== newVal.getTime()) {
          acc[key] = newVal;
        }
      } else if (!deepEqual(oldVal, newVal)) {
        acc[key] = newVal;
      }

      return acc;
    }, {});

    if (Object.keys(changedFields).length === 0) {
      return oldValue;
    }

    const newValue = await prismaTx[model].update({
      where: args.where,
      data: args.data,
    });

    if (!deepEqual(oldValue, newValue)) {
      await setAuditLog(
        'update',
        'update',
        model,
        newValue.id,
        oldValue,
        newValue,
        userId,
        prismaTx,
      );
    }

    return newValue;
  }
}

import { setAuditFields, setAuditLog } from '../audit';

export async function handleCreate(
  prismaTx: any,
  args: any,
  model: string,
  userId: string,
) {
  args.data = { ...args.data };

  await setAuditFields('create', args);

  const newValue = await prismaTx[model].create({
    data: args.data,
  });
  await setAuditLog(
    'create',
    'create',
    model,
    newValue.id,
    null,
    newValue,
    userId,
    prismaTx,
  );

  return newValue;
}

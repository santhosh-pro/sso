import { PrismaClient } from '@prisma/client';
import {
  getCurrentClientIp,
  getCurrentDateInUTC,
  getCurrentUserId,
} from './helper';

export async function setAuditLog(
  action: string,
  operation: string,
  model: string,
  recordId: any,
  oldValue: any,
  newValue: any,
  userId: string,
  prismaTx: PrismaClient,
) {
  await prismaTx.auditLog.create({
    data: {
      action: action,
      operation: operation,
      tableName: model,
      recordId: recordId,
      oldValue: oldValue || null,
      newValue: newValue || null,
      createdBy: userId || 'Anonymous',
      createdAt: getCurrentDateInUTC(),
      createdIp: getCurrentClientIp(),
    },
  });
}

export async function setAuditFields(operation: string, args: any) {
  const userId = getCurrentUserId();

  const data = Array.isArray(args.data) ? args.data : [args.data];

  if (['create'].includes(operation)) {
    data.forEach((item: any) => {
      item.createdBy = userId || 'Anonymous';
      item.createdIp = getCurrentClientIp();
    });
  }

  if (['update'].includes(operation)) {
    data.forEach((item: any) => {
      item.updatedBy = userId || 'Anonymous';
      item.updatedIp = getCurrentClientIp();
    });
  }
}

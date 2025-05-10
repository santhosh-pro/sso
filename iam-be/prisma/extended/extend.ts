import { prismaClient } from '@db/prisma';
import { Logger } from '@nestjs/common';
import { RequestContext } from '@request-context/request-context.model';
import { Request } from 'express';
import { handleCreate } from './operations/create';
import { handleCreateMany } from './operations/create-many';
import { handleDelete } from './operations/delete';
import { handleDeleteMany } from './operations/delete-many';
import { handleUpdate } from './operations/update';
import { handleUpdateMany } from './operations/update-many';
import { decodeJwtToken } from './helper';

function getExtendedPrismaClient(prismaTx: any, isCompanyFilter?: boolean) {
  return prismaClient.$extends({
    query: {
      $allModels: {
        create: ({ args, query, model }) =>
          handleDatabaseOperation(
            'create',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        update: ({ args, query, model }) =>
          handleDatabaseOperation(
            'update',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        createMany: ({ args, query, model }) =>
          handleDatabaseOperation(
            'createMany',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        updateMany: ({ args, query, model }) =>
          handleDatabaseOperation(
            'updateMany',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        delete: ({ args, query, model }) =>
          handleDatabaseOperation(
            'delete',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        deleteMany: ({ args, query, model }) =>
          handleDatabaseOperation(
            'deleteMany',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        findMany: ({ args, query, model }) =>
          handleDatabaseOperation(
            'findMany',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        findUnique: ({ args, query, model }) =>
          handleDatabaseOperation(
            'findUnique',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
        findFirst: ({ args, query, model }) =>
          handleDatabaseOperation(
            'findFirst',
            args,
            query,
            model,
            prismaTx,
            isCompanyFilter,
          ),
      },
    },
  });
}
export { getExtendedPrismaClient };

async function handleDatabaseOperation(
  operation: string,
  args: any,
  query: any,
  model: string,
  prismaTx?: any,
  isCompanyFilter?: boolean,
) {
  if (prismaTx) {
    const startTime = performance.now();
    const req: Request = RequestContext?.currentContext?.req;
    const userId = decodeJwtToken(req.headers.authorization)?.id;
    // const userRole = decodeJwtToken(req.headers.authorization)?.role;
    const companyUserId = decodeJwtToken(
      req.headers.authorization,
    )?.companyUserId;
    console.log(companyUserId);
    // const companyId = decodeJwtToken(req.headers.authorization)?.companyId;

    const prismaClient = prismaTx;
    if (operation === 'updateMany') {
      return handleUpdateMany(prismaClient, args, model, userId);
    } else if (operation === 'create') {
      return handleCreate(prismaClient, args, model, userId);
    } else if (operation === 'createMany') {
      return handleCreateMany(prismaClient, args, model, userId);
    } else if (operation === 'update') {
      return handleUpdate(prismaClient, args, model, userId);
    } else if (operation === 'deleteMany') {
      return handleDeleteMany(prismaClient, args, model, userId);
    } else if (operation === 'delete') {
      return handleDelete(prismaClient, args, model, userId);
    } else if (['findMany', 'findUnique', 'findFirst'].includes(operation)) {
      args.where = { ...args.where };
    }

    const logger = new Logger();
    const executionTime = performance.now() - startTime;

    logger.log({
      level: 'info',
      message: 'Prisma Query',
      query: query,
      args: args,
      executionTime,
    });
    return query(args);
  }
}

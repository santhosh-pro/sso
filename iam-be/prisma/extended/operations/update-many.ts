import { PrismaClient } from '@prisma/client';
import { setAuditFields, setAuditLog } from '../audit';
import { deepEqual } from '../helper';

export async function handleUpdateMany(
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

  args.where = { ...args.where };

  if (!Array.isArray(args.data)) {
    await setAuditFields('updateMany', args);
    const updatedRecords = await prismaTx[model].updateMany({
      where: args.where,
      data: args.data,
    });
    await setAuditLog(
      'updateMany',
      'update',
      model,
      null,
      null,
      args.data,
      userId,
      prismaTx,
    );
    return updatedRecords;
  }

  const existingRecords = await prismaTx[model].findMany({ where: args.where });
  const idToOldValueMap = new Map(
    existingRecords.map((oldValue: any) => [oldValue.id, oldValue]),
  );
  const processedIds = new Set();

  const updatedRecords = await updateRecords(
    prismaTx,
    model,
    args,
    idToOldValueMap,
    processedIds,
    userId,
  );
  const createdRecords = await createRecords(
    prismaTx,
    model,
    args,
    idToOldValueMap,
    userId,
  );
  const newValues = [...updatedRecords, ...createdRecords];

  const deletedRecords = await deleteRecords(
    idToOldValueMap,
    newValues,
    prismaTx,
    model,
    userId,
  );

  return { newValues, deletedRecords };
}

async function updateRecords(
  prismaTx: PrismaClient,
  model: string,
  args: any,
  idToOldValueMap: Map<any, any>,
  processedIds: Set<any>,
  userId: string,
) {
  const recordsToUpdate: { id: any; data: any }[] = [];
  const auditPromises: Promise<void>[] = [];

  for (const recordData of args.data) {
    let newRecord = null;

    const oldValue =
      recordData.id && idToOldValueMap.has(recordData.id)
        ? idToOldValueMap.get(recordData.id)
        : null;

    if (oldValue) {
      const changedFields = Object.keys(recordData).reduce((acc, key) => {
        if (!deepEqual(oldValue[key], recordData[key])) {
          acc[key] = recordData[key];
        }
        return acc;
      }, {});

      if (Object.keys(changedFields).length > 0) {
        recordsToUpdate.push({ id: recordData.id, data: changedFields });
        processedIds.add(recordData.id);
        auditPromises.push(
          setAuditLog(
            'updateMany',
            'update',
            model,
            recordData.id,
            oldValue,
            { id: recordData.id, ...changedFields },
            userId,
            prismaTx,
          ),
        );
      } else {
        newRecord = oldValue;
      }
    } else {
      newRecord = recordData;
    }

    recordsToUpdate.push(newRecord || recordData);
  }

  if (recordsToUpdate.length > 0) {
    const validIds = recordsToUpdate
      .filter((record) => record.id !== undefined && record.data !== undefined)
      .map((record) => record.id);

    const readyToUpdateData = recordsToUpdate.reduce((acc, { id, data }) => {
      if (data !== undefined && Object.keys(data).length > 0) {
        acc[id] = data;
      }
      return acc;
    }, {});

    if (validIds.length > 0 && Object.keys(readyToUpdateData).length > 0) {
      const updatePromises = validIds.map((id) => {
        const data = readyToUpdateData[id];

        if (data) {
          return prismaTx[model].updateMany({
            where: { id },
            data,
          });
        }
        return null;
      });

      const filteredUpdatePromises = updatePromises.filter(Boolean);

      if (filteredUpdatePromises.length > 0) {
        await Promise.all(filteredUpdatePromises);
      }
    }
  }

  await Promise.all(auditPromises);

  return recordsToUpdate;
}

async function createRecords(
  prismaTx: PrismaClient,
  model: string,
  args: any,
  idToOldValueMap: Map<any, any>,
  userId: string,
) {
  const recordsToCreate: any[] = [];
  const auditPromises: Promise<void>[] = [];

  for (const recordData of args.data) {
    if (!recordData.id || !idToOldValueMap.has(recordData.id)) {
      recordsToCreate.push(recordData);
      auditPromises.push(
        setAuditLog(
          'updateMany',
          'create',
          model,
          null,
          null,
          recordData,
          userId,
          prismaTx,
        ),
      );
    }
  }

  if (recordsToCreate.length > 0) {
    await prismaTx[model].createMany({
      data: recordsToCreate,
    });
  }

  await Promise.all(auditPromises);

  return recordsToCreate;
}

async function deleteRecords(
  idToOldValueMap: Map<any, any>,
  newValues: any[],
  prismaTx: PrismaClient,
  model: string,
  userId: string,
) {
  const recordsToDelete: { id: any; oldValue: any }[] = [];
  const auditPromises: Promise<void>[] = [];

  for (const [removedId, removedOldValue] of idToOldValueMap.entries()) {
    if (!newValues.some((newValue) => newValue.id === removedId)) {
      recordsToDelete.push({ id: removedId, oldValue: removedOldValue });
      auditPromises.push(
        setAuditLog(
          'updateMany',
          'hardDelete',
          model,
          removedId,
          removedOldValue,
          null,
          userId,
          prismaTx,
        ),
      );
    }
  }

  if (recordsToDelete.length > 0) {
    await prismaTx[model].deleteMany({
      where: {
        id: { in: recordsToDelete.map((record) => record.id) },
      },
    });
  }

  await Promise.all(auditPromises);

  return recordsToDelete;
}

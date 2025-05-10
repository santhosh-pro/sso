import { RequestContext } from '@request-context/request-context.model';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export function getCurrentUserId() {
  const req: Request = RequestContext?.currentContext?.req;
  return decodeJwtToken(req.headers.authorization)?.id;
}

export function getCurrentClientIp() {
  const req: Request = RequestContext?.currentContext?.req;
  return getClientIp(req);
}

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = xForwardedFor
    ? Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor.split(',')[0]
    : req.connection.remoteAddress;

  return ip?.includes(':') ? req.socket.remoteAddress || '' : ip || '';
}

export function sortObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  return Array.isArray(obj)
    ? obj.map(sortObject)
    : Object.keys(obj)
        .sort()
        .reduce((sortedObj, key) => {
          sortedObj[key] = sortObject(obj[key]);
          return sortedObj;
        }, {});
}

export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(sortObject(obj1)) === JSON.stringify(sortObject(obj2));
}

export function getCurrentDateInUTC(): string {
  const currentDateUTC = new Date();

  const year = currentDateUTC.getUTCFullYear();
  const month = String(currentDateUTC.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentDateUTC.getUTCDate()).padStart(2, '0');
  const hours = String(currentDateUTC.getUTCHours()).padStart(2, '0');
  const minutes = String(currentDateUTC.getUTCMinutes()).padStart(2, '0');
  const seconds = String(currentDateUTC.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

export function decodeJwtToken(
  authorizationHeader: string | undefined,
): any | undefined {
  if (!authorizationHeader) return undefined;

  const token = authorizationHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch {
    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  }
}

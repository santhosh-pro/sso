import { Request } from 'express';

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = xForwardedFor
    ? Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor.split(',')[0]
    : req.connection.remoteAddress;

  return ip?.includes(':') ? req.socket.remoteAddress || '' : ip || '';
}

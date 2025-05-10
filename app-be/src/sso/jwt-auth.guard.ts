import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private client = jwksClient({
    jwksUri: 'http://localhost:8080/realms/master/protocol/openid-connect/certs',
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === 'string' || !decodedHeader.header.kid) {
      throw new UnauthorizedException('Invalid token header');
    }

    const key = await this.client.getSigningKey(decodedHeader.header.kid);
    const publicKey = key.getPublicKey();

    try {
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: 'http://localhost:8080/realms/master',
      });
      request['user'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}

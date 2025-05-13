import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Request } from 'express';
import { createPublicKey } from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private client = jwksClient({
    jwksUri: 'http://localhost:3000/.well-known/jwks.json',
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decodedHeader = jwt.decode(token, { complete: true });

    if (!decodedHeader || typeof decodedHeader === 'string') {
      throw new UnauthorizedException('Invalid token');
    }

    console.log('Decoded JWT:', JSON.stringify(decodedHeader, null, 2));

    let publicKey: string;

    if (decodedHeader.header.kid) {
      const key = await this.client.getSigningKey(decodedHeader.header.kid);
      console.log('JWK with kid:', key);
      publicKey = key.getPublicKey();
    } else {
      const keys = await this.client.getKeys();
      if (!Array.isArray(keys) || keys.length === 0) {
        throw new UnauthorizedException('No keys found in JWKS');
      }
      const key = keys[0];
      console.log('Fallback JWK:', key);
      const pem = createPublicKey({
        key: {
          kty: key.kty,
          n: key.n,
          e: key.e,
        },
        format: 'jwk',
      }).export({ type: 'spki', format: 'pem' });
      publicKey = typeof pem === 'string' ? pem : pem.toString();
    }

    try {
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });
      request['user'] = payload;
      return true;
    } catch (err) {
      console.error('JWT verification error:', err);
      throw new UnauthorizedException('Token verification failed: ' + err.message);
    }
  }
}
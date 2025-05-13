import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModuleOptions } from './auth.module';

@Injectable()
export class AuthService {
  @Inject() jwtService: JwtService;
  @Inject('AUTH_OPTIONS') private readonly appConfig: AuthModuleOptions;

  async sign(payload: any, jwtPrivateKey?: string, expiresIn?: string) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      secret: jwtPrivateKey ?? this.appConfig.jwtPrivateKey,
      expiresIn: expiresIn ?? this.appConfig.jwtExpire,
    });
  }

  async verify(token: string, jwtPublicKey?: string) {
    return this.jwtService.verify(token, {
     algorithms: ['RS256'],
     publicKey: jwtPublicKey ?? this.appConfig.jwtPublicKey,
    });
  }

  async decode(token: string) {
    const decoded = this.jwtService.decode(token);
    return decoded;
  }

  async isExpired(token: string): Promise<boolean> {
    try {
      const decoded: any = this.jwtService.decode(token);

      if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
        throw new Error('Invalid token or missing expiration (exp) field');
      }

      const currentTimestamp = Math.floor(Date.now() / 1000); // Current UTC time in seconds
      return currentTimestamp >= decoded.exp;
    } catch (error) {
      console.error('Error in isExpired:', error.message);
      throw new Error('Unable to determine token expiration');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class OAuthService {
  constructor(private readonly httpService: HttpService) {}

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<any> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'your-client-id',
      code,
      redirect_uri: 'your-redirect-uri',
      code_verifier: codeVerifier,
    });

    const response$ = this.httpService.post(
      'https://your-oidc-provider.com/token',
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const response = await lastValueFrom(response$);
    const { access_token: accessToken, id_token: idToken, refresh_token: refreshToken } = response.data;

    // Use your OIDC provider's public key or JWKS to verify the token
    const decoded = jwt.verify(idToken, 'your-public-key'); // Replace with secure public key or use jwks-rsa

    return {
      accessToken,
      idToken,
      refreshToken,
      user: decoded,
    };
  }
}

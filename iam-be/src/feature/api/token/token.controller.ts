/* eslint-disable @typescript-eslint/naming-convention */
import { Controller, Post, HttpCode, HttpStatus, Body, BadRequestException, Inject } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenResponse } from './token-response';
import { BaseController } from '@core/base.controller';
import { AuthService } from '@auth/auth.service';
import { OAuthService } from '../auth.service';

@ApiTags('Auth')
@Controller('protocol/openid-connect/token')
export class TokenController extends BaseController {
  @Inject() public authService: AuthService;
  @Inject() public oAuthService: OAuthService;

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({ status: HttpStatus.OK,description: '',type: TokenResponse, })
  @ApiOperation({ operationId: 'token' })
  @HttpCode(200)
  async execute(
    @Body('code') code: string,
    @Body('code_verifier') code_verifier: string,
    @Body('redirect_uri') redirect_uri: string,
    @Body('client_id') client_id: string,
    @Body('grant_type') grant_type: string,
  ): Promise<TokenResponse> {

    // Ensure the grant type is correct
    if (grant_type !== 'authorization_code') {
      throw new BadRequestException('Invalid grant_type');
    }

    return await this.prismaService.client(async ({ dbContext }) => {
      // // Step 1: Find the authorization code
      // const authCode = await dbContext.authorizationCode.findUnique({
      //   where: { code },
      // });

      // // Step 2: Validate authorization code
      // if (!authCode || authCode.expiresAt < new Date()) {
      //   throw new BadRequestException('Invalid or expired code');
      // }

      // // Step 3: Ensure clientId and redirectUri match
      // if (authCode.clientId !== client_id || authCode.redirectUri !== redirect_uri) {
      //   throw new BadRequestException('Invalid client or redirect_uri');
      // }

      // Step 4: Generate PKCE challenge and verify
      const challenge = await this.generateCodeChallenge(code_verifier);
      // if (challenge !== authCode.codeChallenge) {
      //   throw new BadRequestException('PKCE verification failed');
      // }

      // Step 5: Mark authorization code as used
      await dbContext.authorizationCode.deleteMany({
        where: { code },
      });

      // Step 6: Issue JWT tokens
      const accessToken = await this.authService.sign({ name: 'authCode.userId' });
      const refreshToken = await this.authService.sign({ name: 'authCode.userId' });

      // Step 7: Return the tokens
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 3600, // Access token expiration time in seconds
      };
    });
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64urlEncode(new Uint8Array(digest));
  }
  
  private base64urlEncode(data: Uint8Array): string {
    return Buffer.from(data)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

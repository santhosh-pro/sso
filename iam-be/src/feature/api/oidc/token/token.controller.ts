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
import { TokenRequest } from './token-request';
import { OAuthService } from '../../auth.service';

@ApiTags('OIDC')
@Controller('protocol/openid-connect/token')
export class TokenController extends BaseController {
  @Inject() public authService: AuthService;
  @Inject() public oAuthService: OAuthService;

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({ status: HttpStatus.OK, description: '', type: TokenResponse })
  @ApiOperation({ operationId: 'token' })
  @HttpCode(200)
  async execute(
    @Body() body: TokenRequest,
  ): Promise<TokenResponse> {
    const {
      grant_type,
      code,
      code_verifier,
      redirect_uri,
      client_id,
      refresh_token,
    } = body;

    return await this.prismaService.client(async ({ dbContext }) => {
      if (grant_type === 'authorization_code') {
        if (!code || !code_verifier || !redirect_uri) {
          throw new BadRequestException('Missing parameters for authorization_code flow');
        }

        const authCode = await dbContext.authorizationCode.findUnique({
          where: { code, isUsed: false },
        });

        if (!authCode || authCode.expiresAt < new Date()) {
          throw new BadRequestException('Invalid or expired code');
        }

        if (authCode.clientId !== client_id || authCode.redirectUri !== redirect_uri) {
          throw new BadRequestException('Invalid client or redirect_uri');
        }

        const challenge = await this.generateCodeChallenge(code_verifier);
        if (challenge !== authCode.codeChallenge) {
          throw new BadRequestException('PKCE verification failed');
        }

        // Clean up used code
        await dbContext.authorizationCode.update({
          where: { id: authCode.id },
          data: { isUsed: true },
        });

        const accessToken = await this.authService.sign({ sub: 'authCode.userId' });
        const newRefreshToken = await this.authService.sign({ sub: 'authCode.userId', type: 'refresh' });

        return {
          access_token: accessToken,
          refresh_token: newRefreshToken,
          token_type: 'Bearer',
          expires_in: 3600,
        };

      } else if (grant_type === 'refresh_token') {
        if (!refresh_token) {
          throw new BadRequestException('Missing refresh_token');
        }

        let decoded: any;
        try {
          decoded = await this.authService.verify(refresh_token);
        } catch {
          throw new BadRequestException('Invalid refresh_token');
        }

        if (decoded.type !== 'refresh') {
          throw new BadRequestException('Invalid token type');
        }

        const accessToken = await this.authService.sign({ sub: decoded.sub });
        const newRefreshToken = await this.authService.sign({ sub: decoded.sub, type: 'refresh' });

        return {
          access_token: accessToken,
          refresh_token: newRefreshToken,
          token_type: 'Bearer',
          expires_in: 3600,
        };
      }

      throw new BadRequestException('Unsupported grant_type');
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

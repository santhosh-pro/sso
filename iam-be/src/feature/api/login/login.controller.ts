/* eslint-disable @typescript-eslint/naming-convention */
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Res,
  Req,
  UnauthorizedException,
  Inject,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { BaseController } from '@core/base.controller';
import { BcryptService } from '@bcrypt/bcrypt.service';

@ApiTags('Auth')
@Controller('auth/login')
export class LoginController extends BaseController {
  @Inject() public bcryptService: BcryptService;

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
    type: LoginResponse,
  })
  @ApiOperation({ operationId: 'login' })
  @HttpCode(200)
  async execute(
    @Body() body: LoginRequest,
    @Req() req: Request,
    @Res() res: Response,
    @Query('client_id') client_id: string,
    @Query('redirect_uri') redirect_uri: string,
    @Query('code_challenge') code_challenge: string,
    @Query('code_challenge_method') code_challenge_method: string,
    @Query('state') state?: string,
  ): Promise<any> {
    const { username, password } = body;

    return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({ where: { username } });

      if (!user || !this.bcryptService.comparePassword(password, user.password ?? '')) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Save user ID to session for downstream access
      req.session.userId = user.id;

      // Rebuild the redirect URL to the authorize endpoint
      const authUrl = new URL('http://localhost:3000/protocol/openid-connect/auth');
      authUrl.searchParams.set('client_id', client_id);
      authUrl.searchParams.set('redirect_uri', redirect_uri);
      authUrl.searchParams.set('code_challenge', code_challenge);
      authUrl.searchParams.set('code_challenge_method', code_challenge_method);
      if (state) authUrl.searchParams.set('state', state);

      console.log('LoginController: Redirecting to', authUrl.toString());
      res.json({
        redirectUrl: authUrl.toString(),
      });
    });
  }
}

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
  UseInterceptors,
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
import { SnakeToCamelInterceptor } from '@helper/snake-to-camel.interceptor';

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
  @UseInterceptors(SnakeToCamelInterceptor)
  async execute(
  @Body() body: LoginRequest,
  @Req() req: Request,
  @Res() res: Response,
  ): Promise<LoginResponse | void> {
    const {
      username,
      password,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state,
    } = body;

    return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({ where: { username } });

      if (!user || !user.password || !(await this.bcryptService.comparePassword(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      req.session.userId = user.id;

      const authUrl = new URL('http://localhost:3000/protocol/openid-connect/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
      if (state) authUrl.searchParams.set('state', state);

      console.log('LoginController: Redirecting to', authUrl.toString());
      res.json({
        redirectUrl: authUrl.toString(),
      });
    });
  }
}

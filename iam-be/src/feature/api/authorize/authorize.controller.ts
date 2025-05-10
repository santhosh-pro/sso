/* eslint-disable @typescript-eslint/naming-convention */
import { Controller, Get, Query, Req, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizeRequest } from './authorize-request';
import { AuthorizeResponse } from './authorize-response';
import { BaseController } from '@core/base.controller';

@ApiTags('Auth')
@Controller('protocol/openid-connect/auth')
export class AuthorizeController extends BaseController {

  // @UseGuards(SessionGuard)
  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: '', type: AuthorizeResponse, })
  @ApiOperation({ operationId: 'authorize' })
  @HttpCode(200)
  async execute(
    @Query() param: AuthorizeRequest, @Req() req: Request,
    @Res() res: Response,): Promise<any> {
    console.log('AuthorizeController: Session:', req.session);
    const { client_id, redirect_uri, code_challenge, code_challenge_method, state } = param;
    const userId = req.
      session.userId;

    if (!userId) {
      const loginUrl = new URL('http://localhost:7000/login');
      loginUrl.searchParams.set('client_id', client_id);
      loginUrl.searchParams.set('redirect_uri', redirect_uri);
      loginUrl.searchParams.set('code_challenge', code_challenge ?? '');
      loginUrl.searchParams.set('code_challenge_method', code_challenge_method ?? '');
      if (state) loginUrl.searchParams.set('state', state);

      return res.redirect(loginUrl.toString());
    }

    return await this.prismaService.client(async ({ dbContext }) => {
      // const client = await dbContext.client.findUnique({
      //   where: { clientId: client_id },
      //   include: { redirectUrls: true },
      // });

      // if (!client || !client.redirectUrls.some((url: { url: string }) => url.url === redirect_uri)) {
      //   throw new BadRequestException('Invalid client or redirect_uri');
      // }

      const code = crypto.randomUUID();
      // await dbContext.authorizationCode.create({
      //   data: {
      //     code,
      //     clientId: client.id,
      //     userId,
      //     redirectUri: redirect_uri,
      //     codeChallenge: code_challenge,
      //     codeChallengeMethod: code_challenge_method,
      //     state,
      //     expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      //   },
      // });

      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('code', code);
      if (state) redirectUrl.searchParams.set('state', state);

      console.log('AuthorizeController: Redirecting to', redirectUrl.toString());
      // res.json({
      //   code,
      //   redirectUrl: redirectUrl.toString(),
      // });
       res.redirect(redirectUrl.toString());
    });
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
import { Controller, Get, Query, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '@core/base.controller';
import { LogoutResponse } from './logout-response';

@ApiTags('Auth')
@Controller('protocol/openid-connect/logout')
export class LogoutController extends BaseController {

  @Get()
  @ApiOperation({ operationId: 'logout' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logs out the user' })
  async execute(
    @Req() req: Request,
    @Res() res: Response,
    @Query('post_logout_redirect_uri') postLogoutRedirectUri?: string,
    @Query('id_token_hint') idTokenHint?: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ successMessage: 'Logout failed' });
        }
  
        // Clear the session cookie
        res.clearCookie('connect.sid');  // Adjust cookie settings as needed
  
        // Redirect or respond with success
        res.status(HttpStatus.OK).json({ successMessage: 'Logged out successfully' });
      });
  });
}
}

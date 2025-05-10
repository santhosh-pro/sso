import { Controller, Get, HttpCode, HttpStatus, Query, Req, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InfoRequest } from './info-request';
import { InfoResponse } from './info-response';
import { BaseController } from '@core/base.controller';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('/info')
export class InfoController extends BaseController {

  @Get()
  @ApiResponse({ status: HttpStatus.OK,description: '',type: InfoResponse, })
  @ApiOperation({ operationId: 'info' })
  @HttpCode(200)
  async execute(
    @Query() param: InfoRequest, @Req() req: Request,@Res() res: Response,
    
  ): Promise<any> {

    const userId = req.session.userId;

    res.redirect('http://localhost:4200/?code=60958cce-7003-4eb2-9e93-2e969b2372f5&state=fdcff648-369a-460b-944b-9b35487b1ab5');

  }
}

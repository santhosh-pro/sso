import { Controller, Put, HttpCode, HttpStatus, Body,Param,HttpException } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ForgotPasswordRequest } from './forgot-password-request';
import { ForgotPasswordResponse } from './forgot-password-response';
import { BaseController } from '@core/base.controller';

@ApiTags('Auth')
@Controller('/forgot-password')
export class ForgotPasswordController extends BaseController {

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK,description: '',type: ForgotPasswordResponse, })
  @ApiOperation({ operationId: 'forgotPassword' })
  @HttpCode(200)
  async execute(@Param('id') id: string, @Body() body: ForgotPasswordRequest,): Promise<ForgotPasswordResponse> {
    throw new HttpException('Method not implemented.', HttpStatus.NOT_IMPLEMENTED);
  }
}

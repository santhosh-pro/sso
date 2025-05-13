import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwksResponse } from './jwks-response';
import { BaseController } from '@core/base.controller';

@ApiTags('OIDC')
@Controller('.well-known/jwks.json')
export class JwksController extends BaseController {

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: '', type: JwksResponse, })
  @ApiOperation({ operationId: 'jwks' })
  @HttpCode(200)
  async execute(): Promise<JwksResponse> {
    {
      const jwks = {
        keys: [
          {
            'kid': 'your-key-id',
            'kty': 'RSA',
            'alg': 'RS256',
            'use': 'sig',
            'n': 'm-g-4YnMFDbh-rN8SzOOBablAAqEiZO3bOr6hrKfZ2aefGz3QylRp9arKCIZ-l0vPtwH-EflshegNa2Q16_4E_CjH_-S5km5EOTqvvrXzf-cWDaYS0RYS8X828b7Xrh4lx3TA1QMnBUTT-pvYLIRz-wUvjeRCC_X-BvUdiJXQPgknN_lcE5E8fwZXG3rDnx855itBQ6vSZq-IzUrT8HrRTOI5DRLK_I_sLWdXnGuOTiDvgUjwq4OnUfJdzd8TCdgcHQK-XLYqXonDhm4lIBFH36Ctr5V0z_H3lohA1b5jqjeMoXk5XWPDxEqGiL5f6O-hV9iWYMz6cT9RuDlYJSoPw',
            'e': 'AQAB'
          }
        ]
      };

      return jwks;
    }

  }
}

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigurationResponse } from './configuration-response';
import { BaseController } from '@core/base.controller';

@ApiTags('OIDC')
@Controller('.well-known/openid-configuration')
export class ConfigurationController extends BaseController {

   @Get()
  @ApiResponse({ status: HttpStatus.OK,description: '',type: ConfigurationResponse, })
  @ApiOperation({ operationId: 'configuration' })
  @HttpCode(200)
  async execute(): Promise<ConfigurationResponse> {
    const config = {
      issuer: 'http://localhost:3000',  // The URL of your OIDC provider
      authorization_endpoint: 'http://localhost:3000/oauth2/authorize',
      token_endpoint: 'http://localhost:3000/oauth2/token',
      userinfo_endpoint: 'http://localhost:3000/oauth2/userinfo',
      jwks_uri: 'http://localhost:3000/.well-known/jwks.json',  // URL for public keys
      response_types_supported: ['code', 'id_token', 'token id_token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      token_endpoint_auth_methods_supported: ['client_secret_basic'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      scopes_supported: ['openid', 'profile', 'email'],
      claim_types_supported: ['normal'],
      claims_supported: ['sub', 'name', 'email', 'preferred_username'],
      code_challenge_methods_supported: ['S256'],
    };

    return config;
  }
}

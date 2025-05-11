/* eslint-disable @typescript-eslint/naming-convention */
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigurationResponse {
  @ApiProperty({
    description: 'The URL of the OpenID Connect provider.',
  })
  @IsString()
  issuer: string;

  @ApiProperty({
    description: 'The URL to redirect users for authentication.',
  })
  @IsString()
  authorization_endpoint: string;

  @ApiProperty({
    description: 'The URL to exchange an authorization code for tokens.',
  })
  @IsString()
  token_endpoint: string;

  @ApiProperty({
    description: 'The URL to obtain user information.',
  })
  @IsString()
  userinfo_endpoint: string;

  @ApiProperty({
    description: 'The URL of the public keys used to verify JWT tokens.',
  })
  @IsString()
  jwks_uri: string;

  @ApiProperty({
    description: 'The supported response types in authorization requests.',
  })
  @IsString({ each: true })
  response_types_supported: string[];

  @ApiProperty({
    description: 'The supported subject identifier types.',
  })
  @IsString({ each: true })
  subject_types_supported: string[];

  @ApiProperty({
    description: 'The supported signing algorithms for ID tokens.',
  })
  @IsString({ each: true })
  id_token_signing_alg_values_supported: string[];

  @ApiProperty({
    description: 'The authentication methods supported at the token endpoint.',
  })
  @IsString({ each: true })
  token_endpoint_auth_methods_supported: string[];

  @ApiProperty({
    description: 'The supported OAuth 2.0 grant types.',
    example: ['authorization_code', 'refresh_token'],
  })
  @IsString({ each: true })
  grant_types_supported: string[];

  @ApiProperty({
    description: 'The supported scopes for the client.',
    example: ['openid', 'profile', 'email'],
  })
  @IsString({ each: true })
  scopes_supported: string[];

  @ApiProperty({
    description: 'The supported claims for the ID token.',
    example: ['sub', 'name', 'email', 'preferred_username'],
  })
  @IsString({ each: true })
  claims_supported: string[];

  @ApiProperty({
    description: 'The supported methods for PKCE code challenges.',
    example: ['S256'],
  })
  @IsString({ each: true })
  code_challenge_methods_supported: string[];
}

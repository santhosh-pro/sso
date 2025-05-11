/* eslint-disable @typescript-eslint/naming-convention */
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthorizeRequest {
  @ApiProperty({
    description: 'The client ID issued to the client during the registration process.',
    example: 'my-client-id',
  })
  @IsString()
  client_id: string;

  @ApiProperty({
    description: 'The redirect URI to which the response will be sent.',
    example: 'https://client.example.org/callback',
  })
  @IsString()
  redirect_uri: string;

  @ApiPropertyOptional({
    description: 'Code challenge used for PKCE flow.',
    example: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
  })
  @IsOptional()
  @IsString()
  code_challenge?: string;

  @ApiPropertyOptional({
    description: 'Method used to generate the code challenge.',
    example: 'S256',
  })
  @IsOptional()
  @IsString()
  code_challenge_method?: string;

  @ApiPropertyOptional({
    description: 'Opaque value used to maintain state between the request and the callback.',
    example: 'af0ifjsldkj',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Space-separated list of scopes the client is requesting.',
    example: 'openid profile email',
  })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiPropertyOptional({
    description: 'The type of response desired. Typically "code" for Authorization Code Flow.',
    example: 'code',
  })
  @IsOptional()
  @IsString()
  response_type?: string;
}

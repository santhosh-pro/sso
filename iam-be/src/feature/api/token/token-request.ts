import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class TokenRequest {
  @IsEnum(['authorization_code', 'refresh_token'], {
    message: 'grant_type must be "authorization_code" or "refresh_token"',
  })
  grant_type: 'authorization_code' | 'refresh_token';

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  code_verifier?: string;

  @IsString()
  @IsOptional()
  redirect_uri?: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsOptional()
  refresh_token?: string;
}

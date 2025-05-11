/* eslint-disable @typescript-eslint/naming-convention */
import { IsNumber, IsString } from 'class-validator';

export class TokenResponse {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsString()
  token_type: string;

  @IsNumber()
  expires_in: number;
}

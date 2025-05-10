/* eslint-disable @typescript-eslint/naming-convention */
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class TokenRequest {
    @IsString()
    @IsNotEmpty()
    code: string;
  
    @IsString()
    @IsNotEmpty()
    code_verifier: string;
  
    @IsString()
    @IsNotEmpty()
    redirect_uri: string;
  
    @IsString()
    @IsNotEmpty()
    client_id: string;
  
    @IsEnum(['authorization_code'], {
      message: 'grant_type must be "authorization_code"',
    })
    grant_type: 'authorization_code';
  
}

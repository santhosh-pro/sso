/* eslint-disable @typescript-eslint/naming-convention */
import { IsOptional, IsString } from 'class-validator';

export class AuthorizeRequest {
    @IsString()
    client_id: string;
  
    @IsString()
    redirect_uri: string;
  
    @IsOptional()
    @IsString()
    code_challenge?: string;
  
    @IsOptional()
    @IsString()
    code_challenge_method?: string;
  
    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    scope?: string;

    @IsOptional()
  @IsString()
  response_type?: string;
}

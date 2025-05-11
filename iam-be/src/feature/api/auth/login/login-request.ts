import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import the ApiProperty decorator

export class LoginRequest {
  
    @ApiProperty({
        description: 'The username for the login request',
    })
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @ApiProperty({
        description: 'The password for the login request',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty({
        description: 'The client ID associated with the login request',
    })
    @IsString()
    @IsNotEmpty()
    clientId: string;
  
    @ApiProperty({
        description: 'The redirect URI after login',
    })
    @IsString()
    @IsNotEmpty()
    redirectUri: string;
  
    @ApiProperty({
        description: 'The code challenge for the login request',
    })
    @IsString()
    @IsNotEmpty()
    codeChallenge: string;
  
    @ApiProperty({
        description: 'The method used to generate the code challenge',
    })
    @IsString()
    @IsNotEmpty()
    codeChallengeMethod: string;
  
    @ApiProperty({
        description: 'Optional state parameter to maintain state between the request and callback',
        required: false,
    })
    @IsOptional()
    @IsString()
    state?: string;
}

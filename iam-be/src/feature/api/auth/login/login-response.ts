import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  redirectUrl: string;
}

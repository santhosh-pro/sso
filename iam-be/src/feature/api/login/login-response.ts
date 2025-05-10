import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  successMessage: string;
}

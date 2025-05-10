import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeResponse {
  @ApiProperty()
  successMessage: string;
}

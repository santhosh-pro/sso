import { ApiProperty } from '@nestjs/swagger';

export class DisableUserResponse {
  @ApiProperty()
  successMessage: string;
}

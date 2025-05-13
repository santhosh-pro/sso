import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSelfResponse {
  @ApiProperty()
  successMessage: string;
}

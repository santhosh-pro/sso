import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponse {
  @ApiProperty()
  successMessage: string;
}

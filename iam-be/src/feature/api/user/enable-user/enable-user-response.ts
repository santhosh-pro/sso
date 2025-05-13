import { ApiProperty } from '@nestjs/swagger';

export class EnableUserResponse {
  @ApiProperty()
  successMessage: string;
}

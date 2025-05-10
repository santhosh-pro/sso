import { ApiProperty } from '@nestjs/swagger';

export class InfoResponse {
  @ApiProperty()
  successMessage: string;
}

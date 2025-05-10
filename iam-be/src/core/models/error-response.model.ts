import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseModel {
  @ApiProperty()
  errorMessages: string[];

  @ApiProperty()
  systemErrorMessage?: string;
}

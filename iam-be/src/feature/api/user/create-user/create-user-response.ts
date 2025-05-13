import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateUserResponseData {
  @ApiPropertyOptional()
  id: string | null;

  @ApiPropertyOptional()
  firstName: string | null;

  @ApiPropertyOptional()
  lastName: string | null;

  @ApiPropertyOptional()
  email: string | null;

  @ApiPropertyOptional()
  phoneNumber: string | null;

  @ApiPropertyOptional()
  role: string | null;
}

export class CreateUserResponse {
  @ApiProperty()
  successMessage: string;

  @ApiPropertyOptional({ type: CreateUserResponseData })
  data: CreateUserResponseData | null;
}

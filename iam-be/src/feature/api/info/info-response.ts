/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponse {
  @ApiProperty({
    description: 'Subject Identifier - unique user ID',
    example: '1234567890',
  })
  sub: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Preferred username',
    example: 'johndoe',
  })
  preferred_username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;
}

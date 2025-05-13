import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserResponseData {
  @ApiProperty({ example: 'd1a2b3c4', description: 'User ID' })
  id: string | null;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  firstName: string | null;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  lastName: string | null;

  @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
  email: string | null;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number of the user' })
  phoneNumber?: string | null;

  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  username: string | null;

  @ApiProperty({ example: 'MEMBER', description: 'Role of the user' })
  role: string | null;

  @ApiProperty({ example: true, description: 'Whether the user is active' })
  isActive: boolean | null;
  
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'User creation timestamp' })
  createdAt: string | null;
};

export class GetUserResponse {
  @ApiProperty({ example: 'User has been retrieved successfully' })
  successMessage: string;

  @ApiPropertyOptional({ type: GetUserResponseData })
  data: GetUserResponseData | null;
}


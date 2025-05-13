import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ErrorMessages } from '@core/models/message';

export class CreateUserRequest {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString({ message: ErrorMessages.string('first name') })
  @IsNotEmpty({ message: ErrorMessages.required('first name') })
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
  @IsOptional()
  @IsString({ message: ErrorMessages.string('last name') })
  lastName?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail({}, { message: ErrorMessages.invalidEmail('email') })
  @IsNotEmpty({ message: ErrorMessages.required('email') })
  email: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString({ message: ErrorMessages.string('username') })
  @IsNotEmpty({ message: ErrorMessages.required('username') })
  @MinLength(3, { message: ErrorMessages.minSize('username', 3) })
  username: string;

  @ApiPropertyOptional({ example: 'StrongP@ssw0rd', description: 'User password' })
  @IsOptional()
  @IsString({ message: ErrorMessages.string('password') })
  @MinLength(6, { message: ErrorMessages.minSize('password', 6) })
  password?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.MEMBER, description: 'Role of the user' })
  @IsOptional()
  // Add validation if needed for enum later
  role?: Role;
}

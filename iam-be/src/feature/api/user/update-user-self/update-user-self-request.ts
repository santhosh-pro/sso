import { ErrorMessages } from "@core/models/message";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail } from "class-validator";

export class UpdateUserSelfRequest {
   @ApiPropertyOptional({ example: 'John', description: 'First name of the user' })
   @IsOptional()
   @IsString({ message: ErrorMessages.string('first name') })
   firstName?: string;
 
   @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
   @IsOptional()
   @IsString({ message: ErrorMessages.string('last name') })
   lastName?: string;
 
   @ApiPropertyOptional({ example: 'john@example.com', description: 'Email of the user' })
   @IsOptional()
   @IsEmail({}, { message: ErrorMessages.invalidEmail('email') })
   email?: string;
 
   @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number of the user' })
   @IsOptional()
   @IsString({ message: ErrorMessages.string('phone number') })
   phoneNumber?: string;
}

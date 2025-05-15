import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  HttpException,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { CreateUserRequest } from './create-user-request';
import { CreateUserResponse } from './create-user-response';
import { BaseController } from '@core/base.controller';
import { Role } from '@prisma/client';
import { BcryptService } from '@bcrypt/bcrypt.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users')
export class CreateUserController extends BaseController {
  @Inject() public bcryptService: BcryptService;

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'createUser' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully created',
    type: CreateUserResponse,
  })
  @Authorize(Role.MODRATOR)
  async execute(
    @Body() body: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return await this.prismaService.client(async ({ dbContext }) => {
      const existingUser = await dbContext.user.findUnique({
        where: { username: body.username },
      });

      if (existingUser) {
        throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = body.password
        ? await this.bcryptService.hash(body.password, 10)
        : undefined;

      const user = await dbContext.user.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phoneNumber: body.phoneNumber,
          username: body.username,
          password: hashedPassword,
          role: body.role ?? Role.MEMBER,
        },
      });

      const response: CreateUserResponse = {
        successMessage: 'User created successfully',
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        }
      };

      return response;
    });
  }
}

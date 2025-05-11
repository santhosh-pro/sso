 
import {
  Controller,
  Get,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '@core/base.controller';
import { AuthService } from '@auth/auth.service';
import { UserInfoResponse } from './info-response';

@ApiTags('OIDC')
@Controller('protocol/openid-connect')
export class UserInfoController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Get('userinfo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'userInfo' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user profile information',
    type: UserInfoResponse,
  })
  async getUserInfo(@Headers('authorization') authHeader: string): Promise<any> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    let payload: any;
    try {
      payload = await this.authService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // Lookup user info from DB or use claims directly from token
    const user = await this.prismaService.client(async ({ dbContext }) => {
      return dbContext.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          firstName: true,
          email: true,
          username: true,
        },
      });
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      sub: user.id,
      name: user.firstName,
      email: user.email,
      preferred_username: user.username,
    };
  }
}

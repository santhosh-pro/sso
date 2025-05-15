import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { BaseController } from '@core/base.controller';
import { Prisma, Role } from '@prisma/client';
import { GetUserListRequest } from './get-user-list-request';
import { GetUserListResponse } from './get-user-list-response';
import { SuccessMessages } from '@core/models/message';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users')
export class GetUserListController extends BaseController {
  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: '', type: GetUserListResponse })
  @ApiOperation({ operationId: 'getUserList' })
   @Authorize(Role.MODRATOR)
  @HttpCode(200)
  async execute(@Query() request: GetUserListRequest): Promise<GetUserListResponse> {
    return await this.prismaService.client(async ({ dbContext }) => {
      const whereCondition: Prisma.UserWhereInput = {
        OR: [
          { id: { contains: request.search || '' } },
          { firstName: { contains: request.search || '' } },
          { lastName: { contains: request.search || '' } },
          { email: { contains: request.search || '' } },
        ],
      };

      let orderByCondition: Prisma.UserOrderByWithRelationInput = {};

      switch (request.orderByPropertyName) {
        case 'firstName':
          orderByCondition = { firstName: request.sortingDirection };
          break;
        case 'lastName':
          orderByCondition = { lastName: request.sortingDirection };
          break;
        case 'email':
          orderByCondition = { email: request.sortingDirection };
          break;
        case 'createdDate':
          orderByCondition = { createdAt: request.sortingDirection };
          break;
        default:
          orderByCondition = { createdAt: 'desc' };
          break;
      }

      const count = await dbContext.user.count({ where: whereCondition });

      const items = await dbContext.user.findMany({
        skip: (request.pageNumber - 1) * request.pageSize,
        take: request.pageSize,
        where: whereCondition,
        orderBy: orderByCondition,
      });

      const response: GetUserListResponse = {
        successMessage: SuccessMessages.getListSuccess('User'),
        orderByPropertyName: request.orderByPropertyName || 'createdAt',
        sortingDirection: request.sortingDirection,
        pageNumber: request.pageNumber,
        pageSize: request.pageSize,
        totalCount: count,
        data: items.map((x) => ({
          id: x.id,
          firstName: x.firstName,
          lastName: x.lastName || '',
          email: x.email,
          phoneNumber: x.phoneNumber || '',
          createdDate: x.createdAt,
          isActive: x.isActive,
          roleId: x.role,
          roleName: x.role, // You might need to join with the role table to fetch role name
        })),
      };

      return response;
    });
  }
}

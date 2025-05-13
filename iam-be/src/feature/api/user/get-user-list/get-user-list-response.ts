import { SortingDirection } from '@core/models/sorting-direction';
import { ApiProperty } from '@nestjs/swagger';

class GetUserListItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  roleName: string;
}


export class GetUserListResponse {
  @ApiProperty()
  successMessage: string;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  orderByPropertyName: string;

  @ApiProperty()
  sortingDirection: SortingDirection = SortingDirection.DESC;

  @ApiProperty({ type: [GetUserListItem] })
  data: GetUserListItem[];
}
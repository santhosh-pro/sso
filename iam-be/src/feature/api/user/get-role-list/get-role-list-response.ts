import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GetRoleListItem {
  @ApiPropertyOptional()
  readonly id: string | null;

  @ApiPropertyOptional()
  name: string | null;
}

export class GetRoleListResponse {
  @ApiProperty()
  successMessage: string;

  @ApiProperty({ type: [GetRoleListItem] })
  data: GetRoleListItem[];
}

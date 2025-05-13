import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortingDirection } from '@core/models/sorting-direction';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ErrorMessages } from '@core/models/message';

export class GetUserListRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: ErrorMessages.number('pageNumber') })
  pageNumber: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: ErrorMessages.number('pageSize') })
  pageSize: number = 50;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ErrorMessages.string('sorting direction') })
  @Transform(({ value }) => (value === '' ? undefined : value))
  sortingDirection: SortingDirection = SortingDirection.DESC;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ErrorMessages.string('order by property name') })
  orderByPropertyName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ErrorMessages.string('search term') })
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: ErrorMessages.string('role ID') })
  roleId: string;
}

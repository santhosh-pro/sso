import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function TransformMMYYYYToISO() {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value === 'string' && /^\d{2}\/\d{4}$/.test(value)) {
        const [month, year] = value.split('/');
        try {
          return new Date(`${year}-${month}-01`).toISOString();
        } catch (error) {
          throw new BadRequestException(`Invalid date format: ${value}`, error);
        }
      } else {
        throw new BadRequestException(
          `Invalid date format, expected MM/YYYY: ${value}`,
        );
      }
    }),
  );
}

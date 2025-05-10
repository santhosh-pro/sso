import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
  Type,
} from '@nestjs/common';
import { validateSync, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.isClass(metadata.metatype)) {
      return value;
    }

    // First, use the original transform method to apply implicit conversion
    const transformedValue = await super.transform(value, metadata);

    // Now apply your custom boolean handling logic
    const object = plainToClass(metadata.metatype, value);
    const keys = Object.keys(object);
    for (const key of keys) {
      const fieldValue = object[key];

      // Custom handling for boolean values
      const isBooleanType =
        Reflect.getMetadata('design:type', object, key) === Boolean;
      if (isBooleanType && typeof fieldValue === 'string') {
        if (fieldValue === 'true') {
          transformedValue[key] = true;
        } else if (fieldValue === 'false') {
          transformedValue[key] = false;
        } else {
          throw new BadRequestException([`${key} must be a boolean value`]);
        }
      }
    }

    // Perform regular validation
    const errors: ValidationError[] = validateSync(
      transformedValue,
      this.validatorOptions,
    );
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    return transformedValue;
  }

  private isClass(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.reduce((result: string[], err) => {
      if (err.constraints) {
        result.push(...Object.values(err.constraints));
      }
      return result;
    }, []);
  }
}

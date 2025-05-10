import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SanitizeUndefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (value[key] === 'undefined') {
          value[key] = undefined;
        }
      }
    }
    return value;
  }
}

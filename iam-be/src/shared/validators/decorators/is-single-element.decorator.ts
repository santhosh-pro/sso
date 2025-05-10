import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSingleElement<T>(
  condition: (item: T) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSingleElement',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) {
            return false;
          }
          const count = value.filter(condition).length;
          return count === 1;
        },
        defaultMessage() {
          return 'There must be exactly one element that meets the specified condition.';
        },
      },
    });
  };
}

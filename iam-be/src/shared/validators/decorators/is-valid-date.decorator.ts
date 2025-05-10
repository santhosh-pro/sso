import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: any) {
          const obj = args.object;

          if (
            value === '' ||
            (value instanceof Date && isNaN(value.getTime()))
          ) {
            obj[propertyName] = null;
            return true;
          }

          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        defaultMessage() {
          return 'Date must be a valid date format';
        },
      },
    });
  };
}

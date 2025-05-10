import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ConditionalProperty<T>(
  relatedPropertyName: keyof T,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedPropertyName],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const object = args.object as T;
          const relatedValue = object[relatedPropertyName];

          if (relatedValue) {
            return Array.isArray(value) && value.length > 0;
          } else {
            return (
              value === undefined ||
              (Array.isArray(value) && value.length === 0)
            );
          }
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${String(relatedPropertyName)} is true, so ${args.property} must contain at least one item. If ${String(
            relatedPropertyName,
          )} is false, ${args.property} must be empty or undefined.`;
        },
      },
    });
  };
}

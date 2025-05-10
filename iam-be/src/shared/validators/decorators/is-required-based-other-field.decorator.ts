import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsRequiredBasedOtherField(
  property: string,
  accountTypeValue: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRequiredIfAccountType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, accountTypeValue],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, requiredValue] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (relatedValue === requiredValue) {
            return value !== undefined && value !== null && value !== '';
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is required when ${args.constraints[0]} is ${args.constraints[1]}`;
        },
      },
    });
  };
}

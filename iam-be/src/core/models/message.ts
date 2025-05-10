import { Utils } from '@util/core.util';

export const ErrorMessages = {
  required: (field: string) => `${Utils.toPascalCase(field)} is required`,
  invalidEmail: (field: string) => `Please enter a valid ${field} address`,
  alreadyExist: (field: string) => `This ${field} is already in use`,
  minSize: (field: string, minLength: number) =>
    `${Utils.toPascalCase(field)} must have at least ${minLength} elements`,
  isSingleElement: (field: string) =>
    `${Utils.toPascalCase(field)} must have exactly one element`,
  boolean: (field: string) =>
    `${Utils.toPascalCase(field)} must be true or false`,
  string: (field: string) =>
    `${Utils.toPascalCase(field)} must be a valid string`,
  number: (field: string) =>
    `${Utils.toPascalCase(field)} must be a valid number`,
  date: (field: string) =>
    `${Utils.toPascalCase(field)} must be a valid date format`,
  enum: (field: string, enumType: object) =>
    `${Utils.toPascalCase(field)} must be one of the following: ${Utils.enumValuesToString(enumType)}`,
};

export const SuccessMessages = {
  changeSuccess: (name: string, change: string) =>
    `${Utils.toPascalCase(name)} has been successfully updated to ${change}`,
  insertSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been created successfully`,
  deleteSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been deleted successfully`,
  updateSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been updated successfully`,
  saveSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been saved successfully`,
  getSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully retrieved`,
  getListSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} have been successfully retrieved`,
  signInSuccess: 'You have successfully signed in',
  signOutSuccess: 'You have successfully signed out',

  submitedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully submitted`,
  approvedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully approved`,
  rejectedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully rejected`,
  activatedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully activated`,
  terminatedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully terminated`,
  inactivatedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully inactivated`,
  enabledSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully enabled`,
  disabledSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully disabled`,
  resetSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully reset`,
  endedSuccess: (value: string) =>
    `${Utils.toPascalCase(value)} has been successfully ended`,
};

import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Utils = {
  isEmptyOrNil(value: unknown): boolean {
    if (value == null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
  },

  enumValuesToString(enumType: object): string {
    const values = Object.values(enumType);
    return values.join(', ');
  },

  getCurrentDateInUTC(): string {
    const currentDateUTC = new Date();

    const year = currentDateUTC.getUTCFullYear();
    const month = String(currentDateUTC.getUTCMonth() + 1).padStart(2, '0');
    const day = String(currentDateUTC.getUTCDate()).padStart(2, '0');
    const hours = String(currentDateUTC.getUTCHours()).padStart(2, '0');
    const minutes = String(currentDateUTC.getUTCMinutes()).padStart(2, '0');
    const seconds = String(currentDateUTC.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  },

  getCurrentDateInUTCDate(): Date {
    const currentDateUTC = new Date();
    return new Date(
      Date.UTC(
        currentDateUTC.getUTCFullYear(),
        currentDateUTC.getUTCMonth(),
        currentDateUTC.getUTCDate(),
        currentDateUTC.getUTCHours(),
        currentDateUTC.getUTCMinutes(),
        currentDateUTC.getUTCSeconds(),
      ),
    );
  },

  getCurrentUnixTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  },

  toDashCase(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  },

  toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  },

  toPascalCase(str: string): string {
    return str.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  },

  getFileExtension(filePath: string): string | null {
    return filePath ? filePath.substring(filePath.lastIndexOf('.')) : null;
  },

  deepEqual(obj1: any, obj2: any): boolean {
    return (
      JSON.stringify(this.sortObject(obj1)) ===
      JSON.stringify(this.sortObject(obj2))
    );
  },

  mapOldValuesById(records: any[]): Map<any, any> {
    const map = new Map();
    records.forEach((oldValue) => map.set(oldValue.id, oldValue));
    return map;
  },

  decodeJwtToken(authorizationHeader: string | undefined): any | undefined {
    if (!authorizationHeader) return undefined;

    const token = authorizationHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return decoded;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  },

  sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    return Array.isArray(obj)
      ? obj.map(this.sortObject)
      : Object.keys(obj)
          .sort()
          .reduce((sortedObj, key) => {
            sortedObj[key] = this.sortObject(obj[key]);
            return sortedObj;
          }, {});
  },
};

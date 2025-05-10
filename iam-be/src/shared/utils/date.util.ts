import { addDays } from 'date-fns';

export function formatDateToMMYYYY(date: Date | string): string {
  let parsedDate: Date;

  if (typeof date === 'string') {
    parsedDate = new Date(date);
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    throw new Error('Invalid date format');
  }

  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = parsedDate.getFullYear();
  return `${month}/${year}`;
}

export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

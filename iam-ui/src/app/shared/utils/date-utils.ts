export class DateUtils {
  convertToMMDDYYYY(dateString: string | undefined | null): string | null {
    if (!dateString) {
      return null;
    }

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  convertTohhmm(dateString: string | undefined | null): string | null {
    if (!dateString) {
      return null;
    }

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  }

  convertToDateTimeString(date: string, time?: string): string | undefined {
    if (!date) {
      return undefined;
    }
    const [month, day, year] = date.split('/').map(Number);  // mm/dd/yyyy format

    const [hours, minutes] = time ? time.split(':').map(Number) : [0, 0];  // 0 hours, 0 minutes (12:00 AM)
    const localDate = new Date(year, month - 1, day, hours, minutes);

    return localDate.toISOString();
  }

  convertToMMYYYYString(mmyyyy: string): string | null {
    if (!mmyyyy || mmyyyy.length !== 7) {
      return null;
    }

    const [month, year] = mmyyyy.split('/');

    return `${month}/${year}`;

  }

  getCurrentDateMMDDYYYY() {
    let today = new Date();
    let currentDate = this.convertToMMDDYYYY(today.toDateString());
    return currentDate;
  }
}

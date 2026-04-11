import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeDate',
  standalone: true
})
export class SafeDatePipe implements PipeTransform {
  transform(value: any, format: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';
    
    let date: Date;
    
    try {
      // Handle different date formats
      if (Array.isArray(value) && value.length >= 3) {
        // Handle array format [year, month, day, ...]
        date = new Date(value[0], value[1] - 1, value[2]);
      } else if (value instanceof Date) {
        // Already a Date object
        date = value;
      } else if (typeof value === 'string' || typeof value === 'number') {
        // Handle string or timestamp
        date = new Date(value);
      } else {
        return ''; // Return empty string for invalid dates
      }

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return '';
      }

      // Format the date
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }
}

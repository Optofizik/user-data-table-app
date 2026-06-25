import { formatDate } from '@angular/common';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a date for display, centralizing the app's date presentation.
 *
 * Wraps Angular's `formatDate` so every date renders the same way (and so the
 * result is a plain string that can be chained into the `highlight` pipe).
 * Pure by default, so it only recomputes when its inputs change.
 *
 * @example {{ user.dob | formatDate }}            // default 'mediumDate'
 * @example {{ user.dob | formatDate: 'yyyy-MM-dd' }}
 */
@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(value: string | Date | null | undefined, format = 'mediumDate'): string {
    if (value == null || value === '') {
      return '';
    }
    return formatDate(value, format, this.locale);
  }
}

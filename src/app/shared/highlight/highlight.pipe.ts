import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** Escapes characters that are significant in HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes characters that are significant in a regular expression. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wraps occurrences of `query` within a value in `<mark>` tags for highlighting.
 *
 * The input text is HTML-escaped before matches are wrapped, and the result is
 * marked trusted so it can be bound via `[innerHTML]` without re-sanitization —
 * the only HTML introduced is the `<mark>` wrapper, never user content.
 *
 * Pure (the default), so Angular memoizes the result and only re-runs the
 * transform when the cell value or the search query actually changes — not on
 * every change-detection pass.
 */
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, query: string | null | undefined): SafeHtml {
    const text = value ?? '';
    const term = (query ?? '').trim();

    if (!term) {
      return this.sanitizer.bypassSecurityTrustHtml(escapeHtml(text));
    }

    // Splitting on a capturing group interleaves the matched segments at odd
    // indices, preserving their original casing.
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    const html = text
      .split(regex)
      .map((part, index) =>
        index % 2 === 1 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part),
      )
      .join('');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

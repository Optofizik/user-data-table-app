import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { UserSort } from '../../domain/user-query.model';
import { User } from '../../domain/user.model';
import { SortDirection, SortField } from '../../domain/users-filters.model';
import { FormatDatePipe } from '../../../../shared/format-date/format-date.pipe';
import { HighlightPipe } from '../../../../shared/highlight/highlight.pipe';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';

/**
 * Presentational users grid.
 *
 * Renders the rows it is given via NG-ZORRO's `nz-table` with front pagination
 * disabled (the store owns paging/filtering/sorting). It is fully controlled:
 * sorting and "load more" intents are emitted as outputs, and search-term
 * highlighting is driven by the `searchQuery` input.
 */
@Component({
  selector: 'app-users-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormatDatePipe,
    HighlightPipe,
    InfiniteScrollDirective,
    NzEmptyModule,
    NzIconModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
  ],
  template: `
    @if (totalCount() === 0 && !loading()) {
      <nz-empty class="users-table__empty" />
    } @else {
      <nz-table
        [nzData]="users()"
        [nzFrontPagination]="false"
        [nzShowPagination]="false"
        [nzLoading]="loading()"
      >
      <thead>
        <tr>
          @for (column of sortableColumns; track column.field) {
            <th
              class="users-table__th users-table__th--sortable"
              role="button"
              tabindex="0"
              [attr.aria-label]="sortLabelFor(column.field, column.label)"
              [attr.aria-sort]="ariaSortFor(column.field)"
              (click)="sortChange.emit(column.field)"
              (keydown.enter)="sortChange.emit(column.field)"
              (keydown.space)="sortByKeyboard($event, column.field)"
            >
              <span>{{ column.label }}</span>
              @if (directionFor(column.field); as direction) {
                <nz-icon
                  [nzType]="direction === 'asc' ? 'sort-ascending' : 'sort-descending'"
                />
              }
            </th>
          }
          <th>Phone</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        @for (user of users(); track user.id) {
          <tr>
            <td>
              <span [innerHTML]="user.firstName | highlight: searchQuery()"></span>
            </td>
            <td>
              <span [innerHTML]="user.lastName | highlight: searchQuery()"></span>
            </td>
            <td>
              <span
                [innerHTML]="user.dob | formatDate | highlight: searchQuery()"
              ></span>
            </td>
            <td>
              <span [innerHTML]="user.phone | highlight: searchQuery()"></span>
            </td>
            <td>
              <nz-tag [nzColor]="user.active ? 'green' : 'red'">
                {{ user.active ? 'Active' : 'Inactive' }}
              </nz-tag>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>

      <div
        class="users-table__sentinel"
        appInfiniteScroll
        [disabled]="!hasMore() || loading()"
        (scrolled)="loadMore.emit()"
      >
        @if (loading() || hasMore()) {
          <nz-spin nzSimple />
        }
      </div>
    }
  `,
  styles: `
    .users-table__th--sortable {
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }

    .users-table__sentinel {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: var(--app-spacing-md) 0;
    }
  `,
})
export class UsersTableComponent {
  /** Rows to render (already filtered/sorted/paginated by the store). */
  readonly users = input.required<User[]>();
  /** Current sort, used to show the direction indicator on headers. */
  readonly sort = input<UserSort | null>(null);
  /** Active search term; matches within cells are highlighted. */
  readonly searchQuery = input<string>('');
  /** Total users matching the current filters; drives the empty state. */
  readonly totalCount = input<number>(0);
  readonly loading = input<boolean>(false);
  readonly hasMore = input<boolean>(false);

  /** Emits the column to sort by; the store cycles asc/desc/off. */
  readonly sortChange = output<SortField>();
  /** Requests the next page of rows. */
  readonly loadMore = output<void>();

  /** Sortable columns, in render order. */
  protected readonly sortableColumns: ReadonlyArray<{
    field: SortField;
    label: string;
  }> = [
    { field: 'firstName', label: 'First name' },
    { field: 'lastName', label: 'Last name' },
    { field: 'dob', label: 'DOB' },
  ];

  /** Sort direction currently applied to `field`, or `null` if unsorted. */
  protected directionFor(field: SortField): SortDirection | null {
    const sort = this.sort();
    return sort?.field === field ? sort.direction : null;
  }

  protected ariaSortFor(field: SortField): 'ascending' | 'descending' | 'none' {
    const direction = this.directionFor(field);

    if (direction === 'asc') {
      return 'ascending';
    }

    if (direction === 'desc') {
      return 'descending';
    }

    return 'none';
  }

  protected sortLabelFor(field: SortField, label: string): string {
    const direction = this.directionFor(field);

    if (direction === 'asc') {
      return `${label}, sorted ascending. Activate to sort descending.`;
    }

    if (direction === 'desc') {
      return `${label}, sorted descending. Activate to clear sorting.`;
    }

    return `${label}, not sorted. Activate to sort ascending.`;
  }

  protected sortByKeyboard(event: Event, field: SortField): void {
    event.preventDefault();
    this.sortChange.emit(field);
  }
}

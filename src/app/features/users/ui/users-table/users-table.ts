import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
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
 */
@Component({
  selector: 'app-users-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormatDatePipe,
    HighlightPipe,
    InfiniteScrollDirective,
    NzFloatButtonModule,
    NzEmptyModule,
    NzIconModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
  ],
  templateUrl: 'users-table.html',
  styleUrl: 'users-table.scss',
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

  readonly DOB_FORMAT = 'dd MMMM yyyy';

  /** Sortable columns, in render order. */
  readonly sortableColumns: ReadonlyArray<{
    field: SortField;
    label: string;
  }> = [
    { field: 'firstName', label: 'First name' },
    { field: 'lastName', label: 'Last name' },
    { field: 'dob', label: 'DOB' },
  ];

  /** Sort direction currently applied to `field`, or `null` if unsorted. */
  directionFor(field: SortField): SortDirection | null {
    const sort = this.sort();
    return sort?.field === field ? sort.direction : null;
  }

  ariaSortFor(field: SortField): 'ascending' | 'descending' | 'none' {
    const direction = this.directionFor(field);

    if (direction === 'asc') {
      return 'ascending';
    }

    if (direction === 'desc') {
      return 'descending';
    }

    return 'none';
  }

  sortLabelFor(field: SortField, label: string): string {
    const direction = this.directionFor(field);

    if (direction === 'asc') {
      return `${label}, sorted ascending. Activate to sort descending.`;
    }

    if (direction === 'desc') {
      return `${label}, sorted descending. Activate to clear sorting.`;
    }

    return `${label}, not sorted. Activate to sort ascending.`;
  }

  sortByKeyboard(event: Event, field: SortField): void {
    event.preventDefault();
    this.sortChange.emit(field);
  }
}

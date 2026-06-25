import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ActiveFilter, AgeFilter } from '../../domain/users-filters.model';

/**
 * Presentational toolbar with the users search box and filter dropdowns.
 *
 * Fully controlled and stateless: it renders the values passed via inputs and
 * emits user changes through outputs. The smart parent feeds the store's
 * signals in and routes the emitted changes back into the store (which
 * debounces the search internally) — so this component holds no state itself.
 */
@Component({
  selector: 'app-users-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NzIconModule, NzInputModule, NzSelectModule],
  template: `
    <div class="users-toolbar">
      <nz-input-wrapper class="users-toolbar__search">
        <nz-icon nzInputPrefix nzType="search" />
        <input
          nz-input
          type="text"
          aria-label="Search users by name or phone"
          placeholder="Search by name or phone"
          [ngModel]="searchQuery()"
          (ngModelChange)="onSearchChange($event)"
        />
      </nz-input-wrapper>

      <nz-select
        class="users-toolbar__filter"
        nzId="users-status-filter"
        nzAriaLabel="Filter users by status"
        nzPlaceHolder="Status"
        [ngModel]="activeFilter()"
        (ngModelChange)="onActiveFilterChange($event)"
      >
        <nz-option nzValue="all" nzLabel="All"></nz-option>
        <nz-option nzValue="active" nzLabel="Active"></nz-option>
        <nz-option nzValue="inactive" nzLabel="Inactive"></nz-option>
      </nz-select>

      <nz-select
        class="users-toolbar__filter"
        nzId="users-age-filter"
        nzAriaLabel="Filter users by age"
        nzPlaceHolder="Age"
        [ngModel]="ageFilter()"
        (ngModelChange)="onAgeFilterChange($event)"
      >
        <nz-option nzValue="all" nzLabel="All ages"></nz-option>
        <nz-option nzValue="under18" nzLabel="Under 18"></nz-option>
        <nz-option nzValue="over18" nzLabel="Over 18"></nz-option>
      </nz-select>
    </div>
  `,
  styles: `
    .users-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--app-spacing-md);
      margin-bottom: var(--app-spacing-md);
    }

    .users-toolbar__search {
      flex: 1 1 240px;
      max-width: 360px;
    }

    .users-toolbar__filter {
      min-width: 140px;
    }
  `,
})
export class UsersToolbarComponent {
  /** Current search text (controlled by the parent). */
  readonly searchQuery = input<string>('');
  /** Current active-status filter selection. */
  readonly activeFilter = input<ActiveFilter>('all');
  /** Current age-bracket filter selection. */
  readonly ageFilter = input<AgeFilter>('all');

  /** Emits on every search keystroke; the parent/store debounces. */
  readonly searchQueryChange = output<string>();
  readonly activeFilterChange = output<ActiveFilter>();
  readonly ageFilterChange = output<AgeFilter>();

  onSearchChange(value: string): void {
    this.searchQueryChange.emit(value);
  }

  onActiveFilterChange(value: ActiveFilter): void {
    this.activeFilterChange.emit(value);
  }

  onAgeFilterChange(value: AgeFilter): void {
    this.ageFilterChange.emit(value);
  }
}

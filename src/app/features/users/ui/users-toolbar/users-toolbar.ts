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
  templateUrl: 'users-toolbar.html',
  styleUrl: 'users-toolbar.scss',
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

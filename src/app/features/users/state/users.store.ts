import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  Signal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { UsersApiService } from '../data/users-api.service';
import { User } from '../domain/user.model';
import { UserSort } from '../domain/user-query.model';
import {
  ActiveFilter,
  AgeFilter,
  SortField,
} from '../domain/users-filters.model';

/** Age that separates the `under18` / `over18` brackets. */
const ADULT_AGE = 18;

/** Debounce window applied to the search input, in milliseconds. */
const SEARCH_DEBOUNCE_MS = 250;

/**
 * A {@link User} augmented with a precomputed, lowercased search string.
 *
 * Building this once at load time means search matching is a single
 * `includes` per row instead of several `.toLowerCase()` calls per keystroke.
 */
interface SearchableUser extends User {
  readonly searchText: string;
}

/**
 * Signal-based store for the users feature.
 */
@Injectable({ providedIn: 'root' })
export class UsersStore {
  private readonly api = inject(UsersApiService);

  // --- State signals (writable internally, exposed read-only) -------------

  private readonly _allUsers = signal<SearchableUser[]>([]);
  private readonly _searchQuery = signal<string>('');
  private readonly _activeFilter = signal<ActiveFilter>('all');
  private readonly _ageFilter = signal<AgeFilter>('all');
  private readonly _sort = signal<UserSort | null>(null);
  private readonly _pageSize = signal<number>(50);
  private readonly _loadedCount = signal<number>(50);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  /** Full dataset, loaded once via {@link load}. */
  readonly allUsers: Signal<User[]> = this._allUsers.asReadonly();
  /** Raw, undebounced search input (reflects the text box immediately). */
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly activeFilter = this._activeFilter.asReadonly();
  readonly ageFilter = this._ageFilter.asReadonly();
  readonly sort = this._sort.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  /** Number of items currently revealed by infinite scroll. */
  readonly loadedCount = this._loadedCount.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Debounced view of {@link searchQuery}. Filtering reads this (not the raw
   * input) so it only reruns once typing pauses for {@link SEARCH_DEBOUNCE_MS}.
   */
  readonly debouncedSearchQuery = toSignal(
    toObservable(this._searchQuery).pipe(debounceTime(SEARCH_DEBOUNCE_MS)),
    { initialValue: '' },
  );

  /** The debounced term, normalized (trimmed + lowercased) exactly once. */
  private readonly normalizedSearch = computed(() =>
    this.debouncedSearchQuery().trim().toLowerCase(),
  );

  // --- Derived selectors (memoized) ---------------------------------------

  /** Users matching the (debounced) search + active filter + age filter. */
  readonly filteredUsers: Signal<User[]> = computed(() => {
    const term = this.normalizedSearch();
    const active = this._activeFilter();
    const age = this._ageFilter();
    return this._allUsers().filter(
      (user) =>
        matchesSearch(user, term) &&
        matchesActive(user, active) &&
        matchesAge(user, age),
    );
  });

  /** {@link filteredUsers} ordered by the current sort (or source order). */
  readonly sortedUsers: Signal<User[]> = computed(() => {
    const users = this.filteredUsers();
    const sort = this._sort();
    if (!sort) {
      return users;
    }
    const direction = sort.direction === 'desc' ? -1 : 1;
    return [...users].sort((a, b) => direction * compareUsersForSort(a, b, sort));
  });

  /** The slice of {@link sortedUsers} currently revealed by infinite scroll. */
  readonly visibleUsers: Signal<User[]> = computed(() =>
    this.sortedUsers().slice(0, this._loadedCount()),
  );

  /** Whether more rows remain beyond {@link visibleUsers}. */
  readonly hasMore = computed(
    () => this.visibleUsers().length < this.sortedUsers().length,
  );

  /** Total number of users matching the current filters. */
  readonly totalCount = computed(() => this.sortedUsers().length);

  constructor() {
    effect(() => {
      this.normalizedSearch();
      this._activeFilter();
      this._ageFilter();
      this._sort();
      untracked(() => this.resetPagination());
    });
  }

  // --- Actions ------------------------------------------------------------

  /** Loads the full dataset once. No-op while a load is already in flight. */
  load(): void {
    if (this._loading()) {
      return;
    }
    this._loading.set(true);
    this._error.set(null);
    this.api.getUsers().subscribe({
      next: (users) => {
        this._allUsers.set(users.map(toSearchableUser));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Unable to load users. Please try again.');
        this._loading.set(false);
      },
    });
  }

  setSearch(query: string): void {
    this._searchQuery.set(query);
  }

  setActiveFilter(value: ActiveFilter): void {
    this._activeFilter.set(value);
  }

  setAgeFilter(value: AgeFilter): void {
    this._ageFilter.set(value);
  }

  /** Cycles the sort for `field`: unsorted → asc → desc → unsorted. */
  setSort(field: SortField): void {
    const current = this._sort();
    if (!current || current.field !== field) {
      this._sort.set({ field, direction: 'asc' });
    } else if (current.direction === 'asc') {
      this._sort.set({ field, direction: 'desc' });
    } else {
      this._sort.set(null);
    }
  }

  /** Reveals one more page of rows. */
  loadMore(): void {
    this._loadedCount.update((count) => count + this._pageSize());
  }

  /** Resets infinite scroll back to the first page. */
  resetPagination(): void {
    this._loadedCount.set(this._pageSize());
  }
}

// --- Pure helpers ---------------------------------------------------------

/** Builds the precomputed, lowercased search index for a user. */
function toSearchableUser(user: User): SearchableUser {
  return {
    ...user,
    searchText: `${user.firstName} ${user.lastName} ${user.phone}`.toLowerCase(),
  };
}

/** Whole years between `dob` (yyyy-MM-dd) and `now`. */
function calculateAge(dob: string, now: Date = new Date()): number {
  const [year, month, day] = dob.split('-').map(Number);
  let age = now.getFullYear() - year;
  const monthDiff = now.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < day)) {
    age--;
  }
  return age;
}

function matchesSearch(user: SearchableUser, term: string): boolean {
  return term === '' || user.searchText.includes(term);
}

function matchesActive(user: User, filter: ActiveFilter): boolean {
  switch (filter) {
    case 'active':
      return user.active;
    case 'inactive':
      return !user.active;
    default:
      return true;
  }
}

function matchesAge(user: User, filter: AgeFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  const age = calculateAge(user.dob);
  return filter === 'under18' ? age < ADULT_AGE : age >= ADULT_AGE;
}

/** Comparison function used by store sorting; `dob` is sorted as an actual date. */
function compareUsersForSort(a: User, b: User, sort: UserSort): number {
  if (sort.field === 'dob') {
    return toDateNumber(a.dob) - toDateNumber(b.dob);
  }

  return a[sort.field].localeCompare(b[sort.field]);
}

/** Converts yyyy-MM-dd into a stable UTC timestamp for sorting comparisons. */
function toDateNumber(dob: string): number {
  const [year, month, day] = dob.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

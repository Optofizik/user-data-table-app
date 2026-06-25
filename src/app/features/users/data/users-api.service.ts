import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { User } from '../domain/user.model';
import { UsersPage, UsersQueryCriteria } from '../domain/user-query.model';
import { SortField } from '../domain/users-filters.model';

/** Location of the seeded mock dataset (served from `src/assets`). */
const USERS_ENDPOINT = 'assets/mocks/users.json';

/**
 * Data-layer access to users.
 *
 * Loads the local mock JSON once over `HttpClient` and caches the result so
 * repeated page requests (e.g. from infinite scroll) reuse the same response
 * instead of re-fetching. The mock payload already matches the domain `User`
 * shape, so it is deserialized directly.
 */
@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);

  /** Users, fetched lazily on first subscription and cached thereafter. */
  private readonly users$: Observable<User[]> = this.http
    .get<User[]>(USERS_ENDPOINT)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  /** Returns the full mapped user collection. */
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  /**
   * Returns a single page of users, simulating a server-side
   * pagination/filtering/sorting endpoint entirely in memory.
   *
   * Kept deliberately thin: it applies the optional `criteria` and slices the
   * result by `offset`/`limit`. The richer filtering orchestration lives in the
   * state layer, which may apply its own logic and call this with no criteria.
   *
   * @param offset Zero-based index of the first item to return.
   * @param limit  Maximum number of items to return; a negative value returns
   *               all remaining items from `offset`.
   * @param criteria Optional filter/sort specification.
   */
  getUsersPage(
    offset: number,
    limit: number,
    criteria?: UsersQueryCriteria,
  ): Observable<UsersPage> {
    return this.users$.pipe(
      map((users) => {
        const matched = this.applyCriteria(users, criteria);
        const start = Math.max(0, offset);
        const items =
          limit < 0 ? matched.slice(start) : matched.slice(start, start + limit);
        return { items, total: matched.length };
      }),
    );
  }

  /** Applies filtering and sorting from `criteria` to a copy of `users`. */
  private applyCriteria(
    users: readonly User[],
    criteria?: UsersQueryCriteria,
  ): User[] {
    let result = users.slice();
    if (!criteria) {
      return result;
    }

    const { search, active, sort } = criteria;

    if (active !== undefined) {
      result = result.filter((user) => user.active === active);
    }

    const term = search?.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
          user.phone.toLowerCase().includes(term),
      );
    }

    if (sort) {
      const direction = sort.direction === 'desc' ? -1 : 1;
      result.sort((a, b) => direction * this.compare(a, b, sort.field));
    }

    return result;
  }

  /**
   * Field comparator. All sortable fields are strings; `dob` (yyyy-MM-dd) sorts
   * chronologically under a plain string comparison.
   */
  private compare(a: User, b: User, field: SortField): number {
    return a[field].localeCompare(b[field]);
  }
}

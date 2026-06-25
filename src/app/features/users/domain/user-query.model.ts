import { User } from './user.model';
import { SortDirection, SortField } from './users-filters.model';

/** A single sort instruction. */
export interface UserSort {
  readonly field: SortField;
  readonly direction: SortDirection;
}

/**
 * Describes how a users collection should be filtered and sorted.
 */
export interface UsersQueryCriteria {
  /** Case-insensitive free-text match across name and phone. */
  readonly search?: string;
  /** Restrict to active/inactive users; `undefined` applies no filter. */
  readonly active?: boolean;
  /** Sort specification; `undefined` preserves source order. */
  readonly sort?: UserSort;
}

/**
 * A slice of users for a single page request.
 *
 * `total` is the number of users matching the criteria *before* pagination, so
 * consumers (e.g. infinite scroll) can tell when the end has been reached.
 */
export interface UsersPage {
  readonly items: readonly User[];
  readonly total: number;
}

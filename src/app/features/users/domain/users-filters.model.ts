/**
 * UI/state-facing filter and sort vocabulary for the users feature.
 */

/** Active-status filter selection. */
export type ActiveFilter = 'all' | 'active' | 'inactive';

/** Age-bracket filter selection (derived from `dob`). */
export type AgeFilter = 'all' | 'under18' | 'over18';

/** Column a users list can be sorted by. */
export type SortField = 'firstName' | 'lastName' | 'dob';

/** Sort direction. */
export type SortDirection = 'asc' | 'desc';

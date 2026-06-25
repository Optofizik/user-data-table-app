export interface User {
  /** Stable unique identifier (GUID). */
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  /** Date of birth as a calendar date, formatted `yyyy-MM-dd`. */
  readonly dob: string;
  readonly phone: string;
  /** Whether the user account is currently active. */
  readonly active: boolean;
}

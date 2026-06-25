/**
 * A user as understood by the application's domain layer.
 *
 * This model is framework-agnostic and intentionally free of any transport or
 * presentation concerns. The `data` layer is responsible for mapping raw API
 * payloads (DTOs) into this shape.
 */
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

import { Routes } from '@angular/router';

/**
 * Users feature routes.
 *
 * The page is a standalone component loaded lazily via `loadComponent`, so the
 * feature's code is only fetched when the `/grid` route is activated. The
 * heavy table within the page is further deferred with `@defer`.
 */
export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/users-page/users-page').then((m) => m.UsersPageComponent),
    title: 'Users',
  },
];

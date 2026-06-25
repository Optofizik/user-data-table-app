import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.routes').then((m) => m.usersRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found',
  },
];

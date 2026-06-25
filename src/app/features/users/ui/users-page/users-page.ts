import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { UsersStore } from '../../state/users.store';
import { UsersTableComponent } from '../users-table/users-table';
import { UsersToolbarComponent } from '../users-toolbar/users-toolbar';

/**
 * Smart container for the users feature route.
 *
 * Owns no state of its own: it triggers the data load and renders the store's
 * signals. The toolbar is part of the initial paint; the heavier table is
 * loaded with `@defer` once the browser is idle, keeping the route's first
 * render light.
 */
@Component({
  selector: 'app-users-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzAlertModule,
    NzButtonModule,
    NzSkeletonModule,
    NzSpinModule,
    UsersToolbarComponent,
    UsersTableComponent,
  ],
  template: `
    <section class="users-page">
      <h1 class="users-page__title">Users</h1>

      @if (store.error(); as error) {
        <nz-alert
          class="users-page__error"
          nzType="error"
          [nzMessage]="error"
          nzShowIcon
        />
      }

      @if (store.loading()) {
        <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }" />
      } @else {
        <app-users-toolbar
          [searchQuery]="store.searchQuery()"
          [activeFilter]="store.activeFilter()"
          [ageFilter]="store.ageFilter()"
          (searchQueryChange)="store.setSearch($event)"
          (activeFilterChange)="store.setActiveFilter($event)"
          (ageFilterChange)="store.setAgeFilter($event)"
        />

        @defer (on idle) {
          <app-users-table
            [users]="store.visibleUsers()"
            [sort]="store.sort()"
            [searchQuery]="store.searchQuery()"
            [totalCount]="store.totalCount()"
            [loading]="store.loading()"
            [hasMore]="store.hasMore()"
            (sortChange)="store.setSort($event)"
            (loadMore)="store.loadMore()"
          />
        } @placeholder {
          <div class="users-page__table-placeholder"></div>
        } @loading (minimum 200ms) {
          <nz-spin nzSimple />
        }
      }
    </section>
  `,
  styles: `
    .users-page {
      display: block;
    }

    .users-page__title {
      margin: 0 0 var(--app-spacing-lg);
      font-size: var(--app-font-size-heading, 20px);
      font-weight: 600;
    }

    .users-page__error {
      margin-bottom: var(--app-spacing-md);
    }

    .users-page__table-placeholder {
      min-height: 200px;
    }
  `,
})
export class UsersPageComponent {
  protected readonly store = inject(UsersStore);

  constructor() {
    this.store.load();
  }
}

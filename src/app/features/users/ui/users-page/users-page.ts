import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { UsersStore } from '../../state/users.store';
import { UsersTableComponent } from '../users-table/users-table';
import { UsersToolbarComponent } from '../users-toolbar/users-toolbar';

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
  templateUrl: 'users-page.html',
  styleUrl: 'users-page.scss',
})
export class UsersPageComponent {
  protected readonly store = inject(UsersStore);

  constructor() {
    this.store.load();
  }
}

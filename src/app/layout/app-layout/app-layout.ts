import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  templateUrl: 'app-layout.html',
  styleUrl: 'app-layout.scss',
})
export class AppLayout {
}

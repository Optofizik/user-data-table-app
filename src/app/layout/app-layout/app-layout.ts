import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

/**
 * Application shell.
 *
 * Provides the persistent header + content frame around all routed views via
 * NG-ZORRO's `nz-layout`. The routed feature pages render through the
 * `<router-outlet />` placed inside `nz-content`.
 *
 * Per the project convention, the NG-ZORRO surface it needs (`NzLayoutModule`)
 * is imported directly here — there is no shared `NgZorroModule` barrel.
 */
@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NzLayoutModule],
  template: `
    <nz-layout class="app-layout">
      <nz-header class="app-layout__header">
        <span class="app-layout__brand">Users</span>
      </nz-header>
      <nz-content class="app-layout__content">
        <router-outlet />
      </nz-content>
    </nz-layout>
  `,
  styles: `
    .app-layout {
      min-height: 100vh;
    }

    .app-layout__header {
      display: flex;
      align-items: center;
      padding-inline: var(--app-spacing-lg);
      background: var(--app-color-bg);
      border-bottom: 1px solid var(--app-color-border);
    }

    .app-layout__brand {
      font-size: 18px;
      font-weight: 600;
      color: var(--app-color-text);
    }

    .app-layout__content {
      padding: var(--app-spacing-lg);
    }
  `,
})
export class AppLayout {}

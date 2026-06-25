import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

/**
 * Application shell.
 *
 * Provides a persistent shell with header, side navigation, and content area
 * around all routed views via NG-ZORRO's `nz-layout`.
 *
 * Per the project convention, the NG-ZORRO surface it needs (`NzLayoutModule`)
 * is imported directly here — there is no shared `NgZorroModule` barrel.
 */
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
  template: `
    <nz-layout class="app-layout">
      <nz-header class="app-layout__header">
        <a routerLink="/">
          <span class="app-layout__brand">Users management app</span>
        </a>
      </nz-header>

      <nz-layout class="app-layout__body">
        <nz-sider
          nzWidth="200"
          class="app-layout__sider"
        >
          <ul
            nz-menu
            nzMode="inline"
            class="app-layout__menu"
          >
            <li
              nz-menu-item
              routerLink="/"
              routerLinkActive="ant-menu-item-selected"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              <nz-icon nzType="home" />
              <span>Home</span>
            </li>
            <li
              nz-menu-item
              routerLink="/grid"
              routerLinkActive="ant-menu-item-selected"
            >
              <nz-icon nzType="team" />
              <span>Grid</span>
            </li>
          </ul>
        </nz-sider>

        <nz-content class="app-layout__content">
          <router-outlet />
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: `
    .app-layout {
      min-height: 100vh;
    }

    .app-layout__header {
      display: flex;
      align-items: center;
      height: 64px;
      padding-inline: var(--app-spacing-lg);
      background: var(--app-color-bg);
      border-bottom: 1px solid var(--app-color-border);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .app-layout__body {
      align-items: flex-start;
    }

    .app-layout__sider {
      background: var(--app-color-bg);
      border-right: 1px solid var(--app-color-border);
      padding-top: var(--app-spacing-sm);
      position: sticky;
      top: 64px;
      height: calc(100vh - 64px);
      z-index: 5;
      width: 200px;
    }

    .app-layout__menu {
      border-inline-end: 0;
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
export class AppLayout {
}

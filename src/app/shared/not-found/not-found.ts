import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

/**
 * 404 page rendered by the `**` wildcard route.
 *
 * Note the import convention: NG-ZORRO modules are imported directly into the
 * standalone component that uses them (`NzResultModule`, `NzButtonModule`).
 * There is intentionally no shared `NgZorroModule` barrel — each component
 * declares only the NG-ZORRO surface it actually needs, which keeps imports
 * explicit and tree-shaking effective.
 */
@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzResultModule, NzButtonModule],
  template: `
    <nz-result
      nzStatus="404"
      nzTitle="404"
      nzSubTitle="Sorry, the page you visited does not exist."
    >
      <div nz-result-extra>
        <a routerLink="/">
          <button nz-button nzType="primary">Back to Home</button>
        </a>
      </div>
    </nz-result>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
  `,
})
export class NotFound {}

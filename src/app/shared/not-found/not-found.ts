import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

/**
 * 404 page rendered by the `**` wildcard route.
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

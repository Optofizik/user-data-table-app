import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home-page">
      <h1 class="home-page__title">Home</h1>
      <p class="home-page__description">
        Browse the Grid section to explore users with search, filters, sorting, and
        infinite scroll.
      </p>
    </section>
  `,
  styles: `
    .home-page {
      display: block;
      padding: var(--app-spacing-sm) 0;
    }

    .home-page__title {
      margin: 0 0 var(--app-spacing-sm);
      font-size: var(--app-font-size-heading, 20px);
      font-weight: 600;
    }

    .home-page__description {
      margin: 0;
      color: var(--app-color-text-secondary);
    }
  `,
})
export class HomeComponent {}

import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

/**
 * Emits {@link scrolled} when the host element (a sentinel placed after the
 * last row) scrolls into view, driving infinite-scroll loading.
 *
 * Uses an `IntersectionObserver` against the viewport with a `rootMargin` so
 * the next page is requested slightly before the sentinel is fully visible.
 * While {@link disabled} (nothing more to load, or a load in flight) emissions
 * are suppressed. When the directive becomes enabled again while the sentinel
 * is still on screen, it emits once more so loading can continue without
 * requiring a fresh scroll.
 */
@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** When true, intersections are ignored. */
  readonly disabled = input<boolean>(false);
  /** Fires when the sentinel becomes visible and the directive is enabled. */
  readonly scrolled = output<void>();

  private isIntersecting = false;

  constructor() {
    // `afterNextRender` runs in the browser only and after the sentinel exists.
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          this.isIntersecting = entries.some((entry) => entry.isIntersecting);
          if (this.isIntersecting && !this.disabled()) {
            this.scrolled.emit();
          }
        },
        { rootMargin: '200px' },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });

    // If the sentinel is already on screen when the directive re-enables (e.g.
    // a load just finished), emit again without waiting for a new intersection.
    effect(() => {
      if (!this.disabled() && this.isIntersecting) {
        this.scrolled.emit();
      }
    });
  }
}

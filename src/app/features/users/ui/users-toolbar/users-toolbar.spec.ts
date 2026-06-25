import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersToolbarComponent } from './users-toolbar';

describe('UsersToolbarComponent keyboard accessibility', () => {
  let fixture: ComponentFixture<UsersToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersToolbarComponent);
    fixture.detectChanges();
  });

  it('keeps toolbar controls keyboard focusable', () => {
    const host = fixture.nativeElement as HTMLElement;
    const focusableControls = Array.from(
      host.querySelectorAll<HTMLElement>('input, [tabindex]'),
    ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex >= 0);

    expect(focusableControls.length).toBeGreaterThanOrEqual(3);
  });

  it('renders an accessible search input label for keyboard/screen-reader users', () => {
    const searchInput = fixture.nativeElement.querySelector(
      'input[nz-input]',
    ) as HTMLInputElement | null;

    expect(searchInput).not.toBeNull();
    expect(searchInput?.getAttribute('aria-label')).toBe(
      'Search users by name or phone',
    );
  });
});

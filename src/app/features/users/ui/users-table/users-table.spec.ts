import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortAscendingOutline, SortDescendingOutline } from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';

import { UserSort } from '../../domain/user-query.model';
import { UsersTableComponent } from './users-table';

describe('UsersTableComponent accessibility', () => {
  let fixture: ComponentFixture<UsersTableComponent>;
  let component: UsersTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTableComponent],
      providers: [provideNzIcons([SortAscendingOutline, SortDescendingOutline])],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('users', [
      {
        id: 'u-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        dob: '1815-12-10',
        phone: '+1 555 000 000',
        active: true,
      },
    ]);
    fixture.componentRef.setInput('totalCount', 1);
    fixture.detectChanges();
  });

  it('marks sortable headers as buttons', () => {
    const sortableHeaders = Array.from(
      fixture.nativeElement.querySelectorAll('th.users-table__th--sortable'),
    ) as HTMLTableCellElement[];

    expect(sortableHeaders.length).toBe(3);
    sortableHeaders.forEach((header) => {
      expect(header.getAttribute('role')).toBe('button');
    });
  });

  it('updates aria-sort according to active sort state', () => {
    const readAriaSort = () => {
      const host = fixture.nativeElement as HTMLElement;
      const headers = Array.from(
        host.querySelectorAll('th.users-table__th--sortable'),
      ) as HTMLTableCellElement[];
      return headers.map((header) => header.getAttribute('aria-sort'));
    };

    expect(readAriaSort()).toEqual(['none', 'none', 'none']);

    fixture.componentRef.setInput('sort', {
      field: 'firstName',
      direction: 'asc',
    } satisfies UserSort);
    fixture.detectChanges();
    expect(readAriaSort()).toEqual(['ascending', 'none', 'none']);

    fixture.componentRef.setInput('sort', {
      field: 'firstName',
      direction: 'desc',
    } satisfies UserSort);
    fixture.detectChanges();
    expect(readAriaSort()).toEqual(['descending', 'none', 'none']);

    fixture.componentRef.setInput('sort', null);
    fixture.detectChanges();
    expect(readAriaSort()).toEqual(['none', 'none', 'none']);
  });

  it('supports keyboard sorting via Enter and Space', () => {
    const sortableHeader = fixture.nativeElement.querySelector(
      'th.users-table__th--sortable',
    ) as HTMLElement;
    const emitSpy = vi.spyOn(component.sortChange, 'emit');

    sortableHeader.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    sortableHeader.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenNthCalledWith(1, 'firstName');
    expect(emitSpy).toHaveBeenNthCalledWith(2, 'firstName');
  });
});

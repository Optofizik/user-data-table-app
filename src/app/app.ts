import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLayout } from './layout/app-layout/app-layout';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

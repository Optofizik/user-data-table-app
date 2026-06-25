import { EnvironmentProviders } from '@angular/core';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  DeleteOutline,
  DownloadOutline,
  EditOutline,
  EllipsisOutline,
  ExclamationCircleOutline,
  EyeOutline,
  FilterOutline,
  LoadingOutline,
  PlusOutline,
  ReloadOutline,
  SearchOutline,
  SettingOutline,
  SortAscendingOutline,
  SortDescendingOutline,
  TeamOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';

/**
 * Icons explicitly registered for the application.
 *
 * NG-ZORRO does not ship every icon by default; only the ones listed here are
 * bundled. Keeping a curated set (instead of registering all icons) keeps the
 * initial bundle within the configured production budget. Add new icons here as
 * features need them.
 */
const appIcons = [
  DeleteOutline,
  DownloadOutline,
  EditOutline,
  EllipsisOutline,
  ExclamationCircleOutline,
  EyeOutline,
  FilterOutline,
  LoadingOutline,
  PlusOutline,
  ReloadOutline,
  SearchOutline,
  SettingOutline,
  SortAscendingOutline,
  SortDescendingOutline,
  TeamOutline,
  UserOutline,
];

/** Registers the curated NG-ZORRO icon set at application bootstrap. */
export function provideAppIcons(): EnvironmentProviders {
  return provideNzIcons(appIcons);
}

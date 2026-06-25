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
  HomeOutline,
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
 */
const appIcons = [
  DeleteOutline,
  DownloadOutline,
  EditOutline,
  EllipsisOutline,
  ExclamationCircleOutline,
  EyeOutline,
  FilterOutline,
  HomeOutline,
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

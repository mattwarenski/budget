import {AppInfo} from './util/app-info';
import {FsStorageProvider} from './util/storage_provider/fs-storage-provider';
import {BoxStorageProvider} from './util/storage_provider/box-storage-provider';

export const ElectronAppInfo: AppInfo = {
  storageProviders : [
    FsStorageProvider,
    BoxStorageProvider
  ]
};

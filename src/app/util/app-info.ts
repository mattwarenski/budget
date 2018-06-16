import {StorageProvider} from './storage_provider/storage.provider';

import {FsStorageProvider} from './storage_provider/fs-storage-provider';

import {BoxStorageProvider} from './storage_provider/box-storage-provider';


export interface AppInfo {

  storageProviders: StorageProvider[];

  //TODO: in the future add settings, views, components and anything else that could be loaded between ionic and electron

}

import { Injectable } from '@angular/core';
import {StorageProvider} from '../util/storage_provider/storage.provider';
import {AbstractTableService} from './abstractTable.service';
import {Settings} from '../model/settings';
import {BoxStorageProvider} from '../util/storage_provider/box-storage-provider';
import {FsStorageProvider} from '../util/storage_provider/fs-storage-provider';
import {Router} from '@angular/router';
import {SqlService} from './sql.service';

@Injectable()
export class SettingsService extends AbstractTableService<Settings>{

  constructor(private __sqlService: SqlService, private router: Router) {
    super(Settings, __sqlService, router);
  }

  get(): Settings{
    let settings = this.getAll();
    return !settings.length ? new Settings() : settings[0];
  }

  getStorageProvider(settings: Settings): StorageProvider{
    if(settings.storageProvider === BoxStorageProvider.displayName){
      return BoxStorageProvider;
    }else {
      return FsStorageProvider;
    }
  }

  setStorageProvider(storageProvider: StorageProvider): void {
    const settings = this.get();
    settings.storageProvider = storageProvider.displayName;
    this.upsertRow(settings);
  }

}

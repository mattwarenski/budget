import { Injectable } from '@angular/core';
import {StorageProvider} from '../util/storage_provider/storage.provider';
import {AbstractTableService} from './abstractTable.service';
import {BoxStorageProvider} from '../util/storage_provider/box-storage-provider';
import {FsStorageProvider} from '../util/storage_provider/fs-storage-provider';
import {Router} from '@angular/router';
import {SqlService} from './sql.service';

@Injectable()
export class SettingsService {

  readonly PROVIDER_NAME_KEY = "settings.providerName";

  constructor(private __sqlService: SqlService, private router: Router) {
    this.loadStorage();
  }

  loadStorage(){
    const storageProvider = this.getStorageProvider();
    const filePath = storageProvider.loadToTmpFile();
    this.__sqlService.loadDB(filePath);
  }

  getStorageProvider(): StorageProvider{
    const providerName = window.localStorage.getItem(this.PROVIDER_NAME_KEY);
    if(providerName === BoxStorageProvider.displayName){
      return BoxStorageProvider;
    }else {
      return FsStorageProvider;
    }
  }

  setStorageProvider(storageProvider: StorageProvider): void {
    window.localStorage.setItem(this.PROVIDER_NAME_KEY, storageProvider.displayName);
    this.loadStorage();
  }

}

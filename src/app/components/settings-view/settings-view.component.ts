import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {StorageProvider} from '../../util/storage_provider/storage.provider';
import {ElectronAppInfo} from '../../electron-app-info';
import {SqlService} from '../../services/sql.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnInit {

  public storageProvider: StorageProvider;
  public storageProviders: any[];

  constructor(private sqlService: SqlService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.storageProvider = this.settingsService.getStorageProvider();


    this.storageProviders = ElectronAppInfo.storageProviders.map(( provider: StorageProvider ) => {
        return {
          label: provider.displayName,
          value: provider
        }
      }
    );
  }

  onProviderChange(selectedProvider: StorageProvider){
    this.storageProvider = selectedProvider;
    this.storageProvider.authenticate();
    this.settingsService.setStorageProvider(selectedProvider);
  }

}

import { Component, OnInit } from '@angular/core';
import {Settings} from '../../model/settings';
import {SettingsService} from '../../services/settings.service';
import {StorageProvider} from '../../util/storage_provider/storage.provider';
import {ElectronAppInfo} from '../../electron-app-info';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnInit {

  private settings: Settings;
  public storageProvider: StorageProvider;
  public storageProviders: any[];

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settings = this.settingsService.get();

    this.storageProvider = this.settingsService.getStorageProvider(this.settings);


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
    this.settingsService.setStorageProvider(selectedProvider);
  }

}

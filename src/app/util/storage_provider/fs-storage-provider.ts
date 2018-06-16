import {StorageProvider} from './storage.provider';

const FILE_NAME_KEY="localFileName";
const electron = window.require('electron');
const fs = window.require('fs');

export const FsStorageProvider : StorageProvider = {
  authenticate: () => {
    const filename = electron.remote.dialog.showOpenDialog({properties: ['openFile']});
    window.localStorage.setItem(FILE_NAME_KEY, filename);
    return;
  },
  loadToTmpFile: (): string => {
    return window.localStorage.getItem(FILE_NAME_KEY);
  },
  save: (tmpFileLocation: string) => {

  },
  getDisplayInfo: (): string => {
    let filename =  window.localStorage.getItem(FILE_NAME_KEY);
    return "Loading file from " + filename;
  },
  displayName: "Local File"
};


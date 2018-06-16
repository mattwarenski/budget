import {StorageProvider} from './storage.provider';

export const BoxStorageProvider : StorageProvider = {
  authenticate: () => {

  },
  loadToTmpFile: (): string => {
    return "";
  },
  save: (tmpFileLocation: string) => {

  },
  getDisplayInfo: (): string => {
    return "Account Name: ";
  },
  displayName: "Box.com"
};


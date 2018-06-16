import {StorageProvider} from './storage.provider';

export const FsStorageProvider : StorageProvider = {
  authenticate: () => {
    return; //no need to authenticate
  },
  loadToTmpFile: (): string => {
    return "";
  },
  save: (tmpFileLocation: string) => {

  },
  displayName: "Local File"
};


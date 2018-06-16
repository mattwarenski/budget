

export interface StorageProvider {

  /**
   * Saves the temp file back to destination
   * @param {string} tmpFileLocation
   */
  save: (tmpFileLocation: string) => void;

  /**
   * Gets file from cloud provider and stores it as a temp file
   * @returns {string}
   */
  loadToTmpFile: ()=>string;

  /**
   * Authenticate with service provdier. Will do nothing if storage is local
   */
  authenticate: ()=>void;

  displayName: string;
}

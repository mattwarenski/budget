import { Injectable } from '@angular/core';

declare global {
  interface Window {
    require: any;
  }
}

let fs = window.require('fs');
let sql = window.require('electron').remote.require('sql.js');


@Injectable()
export class SqlService {
  private db;
  private dbLocation: string;

  constructor() {}

  openDB(dbLocation: string, schemaLocation: string){
    this.dbLocation = dbLocation;
    try{
      this.db = new sql.Database(fs.readFileSync(dbLocation));
    }
    catch(e){
      this.initDB(dbLocation, schemaLocation);
    }
  }

  private initDB(dbLocation: string, schemaLocation: string){
    this.db = new sql.Database();
    const schema = fs.readFileSync(schemaLocation).toString('utf-8');
    this.db.exec(schema);
  }

  closeDB(){
    try{
      let dataBuffer = this.db.export();
      fs.writeFileSync(this.dbLocation, dataBuffer);
    }
    catch(e){
      console.error("Unable to close db", e);
    }
  }
}


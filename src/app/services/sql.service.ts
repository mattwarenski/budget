import { IdCounter } from '../model/idCounter';
import { Injectable } from '@angular/core';
import { Expense } from "../model/expense";
import { createElectronDB } from "sqlite-base/ElectronDataBase";
import { Category } from "../model/category";
import { Account } from '../model/account';

/**
 * Initializes the DB and loads all row entities into the db
 */
@Injectable()
export class SqlService {
  private db;
  private dbLocation: string;
  private dbReady: boolean

  constructor() { }

  loadDB(fileLocation: string){
    this.db = createElectronDB(fileLocation,
      [new Account(),
        new Expense(),
        new Category(),
        new IdCounter()
      ]);

    this.db.initDBSync();

  }

  getDB(){
    return this.db;
  }
}

import { IdCounter } from '../model/idCounter';
import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { Expense } from "../model/expense";
import { createElectronDB } from "sqlite-base/ElectronDataBase";
import { Category } from "../model/category";
import { Account } from '../model/account';
import { DataBase } from 'sqlite-base/DataBase';

/**
 * Initializes the DB and loads all row entities into the db
 */
@Injectable()
export class SqlService {
  private db;
  private dbLocation: string;
  private dbReady: boolean

  constructor() {
    this.db = createElectronDB(environment.dbLocation,
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


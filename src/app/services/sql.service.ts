import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { Expense } from "../model/expense";
import { createElectronDB } from "sqlite-base/ElectronDataBase";
import { AsyncSubject } from "rxjs/AsyncSubject";
import { NgZone } from "@angular/core";
import { Category } from "../model/category";
import { Account } from '../model/account';
import { DataBase } from 'sqlite-base/DataBase';

@Injectable()
export class SqlService {
  private db;
  private dbLocation: string;
  private dbReady: boolean
  private initSubject: AsyncSubject<DataBase>;

  constructor(private zone: NgZone) {
    this.initSubject = new AsyncSubject();
    this.db = createElectronDB(environment.dbLocation, [new Account(), new Expense(), new Category()]);
    this.db.initDB(()=>{
      this.zone.run(()=>{
        this.initSubject.next(this.db)
        this.initSubject.complete();
      });
    });
  }

  getDB(callback){
    let sub = this.initSubject.
      subscribe(
        callback,
        err => console.error("Error in database", err),
        () => sub ? sub.unsubscribe() : null
      );
  }
}


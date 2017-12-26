import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { SqlService } from "./sql.service";
import { DataBase } from "sqlite-base/DataBase";
import { RowEntity } from "sqlite-base/RowEntity";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { DBFilter } from 'sqlite-base/DBFilter';
import { Router } from '@angular/router';


export class AbstractTableService<T extends RowEntity> {
  private sqlService: SqlService;
  private entityConstructor;
  protected db: DataBase;


  constructor(entityConstructor, sqlService: SqlService, router: Router) {
    this.sqlService = sqlService;
    this.entityConstructor = entityConstructor;
    this.db = sqlService.getDB();
  }

  getSum(column: string, filter?: T, dbFilter?: DBFilter): number{
    return this.db.sum(filter ? filter : new this.entityConstructor(), column, dbFilter); 
  }

  getCount(filter?: T, dbFilter?: DBFilter): number{
    return this.db.count(filter ? filter : new this.entityConstructor(), dbFilter); 
  }

  getAll(filter?: T, dbFilter?: DBFilter): T[]{ //only refresh if a filter was passed to begin with
    return this.db.getRows(filter ? filter : new this.entityConstructor(), dbFilter); 
  }

  upsertRow(entity: T): void{
    this.db.upsert(entity);
    //Caching...
    //let currentIndex = this.entities.findIndex( c => entity.id && c.id === entity.id); 
    //if(currentIndex < 0){
      ////get from db so that assigned db id shows up
      //this.entities = this.getRows(db, this.dbFilter);
    //}
    //else{
      //this.entities[currentIndex] = entity; 
    //}
    //this.currentEntities.next(this.entities);
  }

  deleteRow(category: T): void{
    this.db.deleteRow(category);
    //caching
    //let index = this.entities.findIndex( c => category.id === c.id);
    //this.entities.splice(index, 1);
    //this.currentEntities.next(this.entities);
    //});
  }
}

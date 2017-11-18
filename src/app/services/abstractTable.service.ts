import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { SqlService } from "./sql.service";
import { DataBase } from "sqlite-base/DataBase";
import { RowEntity } from "sqlite-base/RowEntity";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { DBFilter } from 'sqlite-base/DBFilter';

export class AbstractTableService<T extends RowEntity> {
  entities: T[] = [];
  private filter: T;
  private fetchedFromDb: boolean;
  private sqlService: SqlService;
  private currentEntities: BehaviorSubject<T[]>;
  private entityConstructor;
  private dbFilter: DBFilter;
  protected db: DataBase;

  constructor(entityConstructor, sqlService: SqlService) {
    this.sqlService = sqlService;
    this.currentEntities = new BehaviorSubject<T[]>([]); 
    this.entityConstructor = entityConstructor;
  }

  getAll(filter?: T, dbFilter?: DBFilter): BehaviorSubject<T[]>{ //only refresh if a filter was passed to begin with
    let filterChanged = this.dbFilter && ( dbFilter.earliestDate != this.dbFilter.earliestDate || this.dbFilter.latestDate != this.dbFilter.latestDate);
    if(filterChanged){
      this.entities = []; 
    }
    this.dbFilter = dbFilter;
    this.filter = filter;
    this.sqlService.getDB(
      db => {
        this.db = db;
        //concat so if the array is modified before this returns no changes are lost
        if(!this.fetchedFromDb || filterChanged ){
          this.entities = this.getRows(db, dbFilter).concat(this.entities);
          this.fetchedFromDb = true;
        }
        this.currentEntities.next(this.entities);
      }); 
    return this.currentEntities;  
  }

  private getRows(db: DataBase, dbFilter?: DBFilter){
    return db.getRows(this.filter ? this.filter : new this.entityConstructor(), dbFilter); 
  }

  upsertRow(entity: T): void{
      this.sqlService.getDB(
        (db: DataBase) => {
          db.upsert(entity);
          let currentIndex = this.entities.findIndex( c => entity.id && c.id === entity.id); 
          if(currentIndex < 0){
            //get from db so that assigned db id shows up
            this.entities = this.getRows(db);
          }
          else{
            this.entities[currentIndex] = entity; 
          }
          this.currentEntities.next(this.entities);
        });
  }

  deleteRow(category: T): void{
    this.sqlService.getDB(
      (db: DataBase) => {
        db.deleteRow(category);
        let index = this.entities.findIndex( c => category.id === c.id);
        this.entities.splice(index, 1);
        this.currentEntities.next(this.entities);
      });
  }
}

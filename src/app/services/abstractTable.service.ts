import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { SqlService } from "./sql.service";
import { DataBase } from "../sql/DataBase";
import { RowEntity } from "../sql/RowEntity";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

export class AbstractTableService<T extends RowEntity> {
  entities: T[] = [];
  private sqlService: SqlService;
  private currentEntities: BehaviorSubject<T[]>;

  constructor(entityConstructor, sqlService: SqlService) {
    this.sqlService = sqlService;
    this.currentEntities = new BehaviorSubject<T[]>([]); 
    this.sqlService.getDB().subscribe(
      db => {
        //concat so if the array is modified before this returns no changes are lost
        this.entities = db.getRows(new entityConstructor()).concat(this.entities); 
        this.currentEntities.next(this.entities);
      }); 
  }

  getAll(): BehaviorSubject<T[]>{
    return this.currentEntities;  
  }

  getRows(filter: T): Observable<T[]>{
    return Observable.create((observer: Observer<T[]>) => {
      this.sqlService.getDB().subscribe(
        db => {
          observer.next(db.getRows(filter));
        });
    }).take(1);
  }

  upsertRow(entity: T): void{
    this.sqlService.getDB().subscribe(
      (db: DataBase) => {
        let currentIndex = this.entities.findIndex( c => c.id === entity.id); 
        if(currentIndex < 0){
          this.entities.push(entity);
        }
        else{
          this.entities[currentIndex] = entity; 
        }
        db.upsert(entity);
        this.currentEntities.next(this.entities);
      });
  }

  deleteRow(category: T): void{
    this.sqlService.getDB().subscribe(
      (db: DataBase) => {
        db.deleteRow(category);
        let index = this.entities.findIndex( c => category.id === c.id);
        this.entities.splice(index, 1);
        this.currentEntities.next(this.entities);
      });
  }
}

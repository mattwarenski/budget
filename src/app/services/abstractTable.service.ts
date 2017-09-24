import { Subject } from "rxjs/Subject";
import { SqlService } from "./sql.service";
import { DataBase } from "../sql/DataBase";
import { PrimaryKeyEntity } from "../sql/PrimaryKeyEntity";

export class AbstractTableService<T extends PrimaryKeyEntity> {
  entities: T[] = [];
  private sqlService: SqlService;
  private currentEntities: Subject<T[]>;


  constructor(entityConstructor, sqlService: SqlService) {
    this.sqlService = sqlService;
    this.currentEntities = new Subject<T[]>(); 
    this.sqlService.getDB().subscribe(
      db => {
        //concat so if the array is modified before this returns no changes are lost
        this.entities = db.getRows(new entityConstructor()).concat(this.entities); 
        this.currentEntities.next(this.entities);
      }); 
  }

  getAll(): Subject<T[]>{
    return this.currentEntities;  
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

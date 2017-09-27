import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { Expense } from "../model/expense";
import { DataBase } from "../sql/DataBase";
import { AsyncSubject } from "rxjs/AsyncSubject";
import { NgZone } from "@angular/core";
import { Category } from "../model/category";
import { Account } from "../sql/Account";

@Injectable()
export class SqlService {
  private db;
  private dbLocation: string;
  private dbReady: boolean
  private initSubject: AsyncSubject<DataBase>;

  constructor(private zone: NgZone) {
    this.initSubject = new AsyncSubject();
    this.db = new DataBase(environment.dbLocation, [new Account(), new Expense(), new Category()]);
    this.db.initDB(()=>{
      this.zone.run(()=>{
        this.initSubject.next(this.db)
        this.initSubject.complete();
      });
    });
  }

  getDB(): AsyncSubject<DataBase>{
    return this.initSubject; 
  }

  //openDB(dbLocation: string, schemaLocation: string){
    //this.dbLocation = dbLocation;
    //try{
      //this.db = new SQL.Database(fs.readFileSync(dbLocation));
      //console.log("Loaded db", dbLocation);
    //}
    //catch(e){
      //this.initDB(dbLocation, schemaLocation);
    //}
  //}

  //listTables(): string{
    //return this.db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  //}

  //selectAll(table: string, entity){
    //let retVal = this.db.exec(`SELECT * FROM ${table};`)  
    //return this.mapObject(retVal, entity);
  //}

  //private mapObject(sqlObject, entity){
    //if(sqlObject && sqlObject.length > 0){
      //let vals = [];
      //sqlObject[0].values.forEach( value => {
        //let obj = new entity();
        //for(let i = 0; i < sqlObject[0].columns.length; i++){
          //let columnName = sqlObject[0].columns[i];
          //if(columnName.includes("date") || columnName.includes("Date")){
            //obj[columnName] = new Date(value[i]);
          //}
          //else{
            //obj[columnName] =  value[i];
          //}
        //}
        //vals.push(obj);
      //})
      //return vals;
    //}
    //return null;
  //}

  //delete(table: string, filters){
    //let clause = (<any>Object).entries(filters).map( ([k, v]) => `${k} = ${v}`).join(" AND ");
    //let stmt = `DELETE * FROM ${table} WHERE ${clause};`
  //}

  //select(table: string, filters, entity): any[]{
    //let clause = (<any>Object).entries(filters).map( ([k, v]) => `${k} = ${v}`).join(" AND ");
    //let stmt = `SELECT * FROM ${table} WHERE ${clause};`;
    //return this.mapObject(this.db.exec(stmt), entity);
  //}

  //upsert(table: string, row: any){
    //let keys = Object.keys(row).map(k => `"${k}"`).join(', ');
    //let values = (<any>Object).values(row).map(k => `?`).join(', ');
    //let stmt = "REPLACE INTO " + table + " (" + keys + ") values (" + values + ");";
    //this.db.exec(stmt);
    //this.writeDB();
  //}

  //private initDB(dbLocation: string, schemaLocation: string){
    //console.log('reating new db');[]
    //this.db = new SQL.Database();
    //const schema = fs.readFileSync(schemaLocation).toString('utf-8');
    //this.db.run(schema);
  //}

  //writeDB(){
    //try{
      //let dataBuffer = this.db.export();
      //fs.writeFileSync(this.dbLocation, dataBuffer);
      //console.log("saved to ", this.dbLocation);
    //}
    //catch(e){
      //console.error("Unable to close db", e);
    //}
  //}
}


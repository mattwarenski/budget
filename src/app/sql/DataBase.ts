import { RowEntity } from "./RowEntity"
import { DBFilter } from "./DBFilter"
import * as SQL from "sql.js"
import { DataType } from "./decorators";
import * as moment from 'moment';

declare global {
  interface Window {
    require: any;
  }
}

let fs = window.require('fs');

export class DataBase{
  private filepath: string;
  private tables: RowEntity[];
  private db: any;
  
  constructor(filepath: string, tables: RowEntity[]){
    this.filepath = filepath;
    this.tables = tables;
  }

  initDB(cb: ()=>void){
    fs.exists(this.filepath, (exists: boolean) => {
      if(exists){
        console.log("db exists");
        this.readDB(cb);
      }
      else{
        console.log("creating db");
        this.db = new SQL.Database();
        this.tables.forEach( t => this.createTable(t));
        cb();
      }
    });
  }

  readDB(cb: ()=>void){
    fs.readFile(this.filepath, (err, data) => {
      if(err){
        throw Error(`Unable to read DB from ${this.filepath}.\nMessage:${err}}`) 
      }
      console.log('read data from ', this.filepath, data);
      this.db = new SQL.Database(data);
      cb();
    })
  }

  writeDB(){
    try{
      let dataBuffer = this.db.export();
      fs.writeFileSync(this.filepath, dataBuffer);
      console.log("saved to ", this.filepath);
    }
    catch(e){
      console.error("Unable to close db", e);
    }
  }

  getTables(){
    return this.db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  }

  getColumns(table: RowEntity){
    return this.db.exec(`PRAGMA table_info(${table.getName()});`);
  }

  upsert(table: RowEntity){
    let vals = [];
    let cols = []
    table.getColumns().forEach( (c, i) => {
      if(table.getValues()[i] !== undefined){
        vals.push(table.getValues()[i]);
        cols.push(c.getName());
      } 
    }); 
     
    let statement = `REPLACE INTO ${table.getName()} (${cols.join(",")}) VALUES (${cols.map( c=>"?")});`;
    try{
      this.db.run(statement, vals); 
      this.writeDB();
    }
    catch(e){
      throw new Error(`Unable to run query: ${statement}.\nValues: ${vals.join(",")}.\n Original Message: ${e.message}`); 
    }
  }

  getAllRows(table){
    let model = new table();
    let statment = this.db.prepare(`SELECT * FROM ${model.getName()};`)
    return this.mapResultsToTable(statment, table);
  }

  private mapResultsToTable<T extends RowEntity>(statement, instance: T){
    let res = [];
    while(statement.step()){
      let row = instance.createNew();
      let columnInfo = instance.getColumns();
      let data = statement.get();
      columnInfo.forEach( (col, index) => {
        if(col.getType() === DataType.DATE){
          let date = moment(data[index]);
          row[col.getName()] = date.toDate();
        }
        else{
          row[col.getName()] = data[index];
        }
      });
      res.push(row);
    }
    return res;
  }

  getRows(modelObject: RowEntity, filter?: DBFilter){
    let filters = [];
    modelObject.getColumns().forEach( ci => modelObject[ci.getName()] ? filters.push(ci.getName()) : null);
    let clause = filters.map( prop => `${prop} = ${modelObject[prop]}`).concat( filter ? filter.getDateConstraints() : []).join(" AND ");
    let where = clause ? "WHERE " + clause : "";
    where += filter ? " " + filter.getSortByClause() : "";
    let statementSql = `SELECT * FROM ${modelObject.getName()} ${where}`;
    let statement = this.db.prepare(statementSql);
    return this.mapResultsToTable(statement, modelObject);
  }

  private createTable(table: RowEntity){
    //this won't update if there are new tables. It will only not create if the table itself exists
    let query = `CREATE TABLE IF NOT EXISTS ${table.getName()}(${table.getColumns().map(c => c.toSqlArg()).join(",")});`;
    this.db.run(query);
  }
}

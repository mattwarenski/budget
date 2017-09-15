import { Table } from "./Table"
import { DBFilter } from "./DBFilter"
import * as SQL from "./third_party/sql-memory-growth"
import * as fs from 'fs';

export class DataBase{
  private filepath: string;
  private tables: Table[];
  private db: any;
  
  constructor(filepath: string, tables: Table[]){
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
    fs.readFile(this.filepath, data => {
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
    console.log("getting tables", this.db);
    return this.db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  }

  getColumns(table: Table){
    //return this.db.run(`SELECT sql FROM sqlite_master WHERE tbl_name='${table.getName()}' AND type='table';`);
    return this.db.exec(`PRAGMA table_info(${table.getName()});`);
  }

  insert(table: Table){
    let statement = `INSERT INTO ${table.getName()} (${table.getColumns().map( c => c.getName()).join(",")}) VALUES (${table.getValues()});`;
    this.db.run(statement) 
  }

  getAllRows(table){
    let model = new table();
    let statment = this.db.prepare(`SELECT * FROM ${model.getName()};`)
    return this.mapResultsToTable(statment);
  }

  private mapResultsToTable(statement){
    let res = [];
    while(statement.step()){
      let row = {};
      let columns =  statement.getColumnNames();
      let data = statement.get();
      columns.forEach( (col, index) => row[col] = data[index]);
      res.push(row);
    }
    return res;
  }

  getRows(modelObject: Table, filter?: DBFilter){
    let filters = [];
    modelObject.getColumns().forEach( ci => modelObject[ci.getName()] ? filters.push(ci.getName()) : null);
    let clause = filters.map( prop => `${prop} = ${modelObject[prop]}`).concat( filter ? filter.getDateConstraints() : []).join(" AND ");
    let where = clause ? "WHERE " + clause : "";
    where += filter ? " " + filter.getSortByClause() : "";
    let statementSql = `SELECT * FROM ${modelObject.getName()} ${where}`;
    let statement = this.db.prepare(statementSql);
    return this.mapResultsToTable(statement);
  }

  private createTable(table: Table){
    //this won't update if there are new tables. It will only not create if the table itself exists
    let query = `CREATE TABLE IF NOT EXISTS ${table.getName()}(${table.getColumns().map(c => c.toSqlArg()).join(",")});`;
    this.db.run(query);
  }
  
}

import { ColumnInfo } from "./ColumnInfo"

export class Table{
  private columns: ColumnInfo[];
  private name: string;
  
  constructor(name: string){
    this.name = name;
    this.init();
  }

  private init(){
    if(!this.columns){
      this.columns = []; 
    }
  }

  addColumn(column: ColumnInfo){
    this.init();
    this.columns.push(column);
  }

  getColumns(): ColumnInfo[]{
    return this.columns; 
  }

  getValues(): any[]{
    return this.columns.map( c => this.formatObject(this[c.getName()]));
  }

  private formatObject(prop: any){
    if(prop instanceof Date){
      return `'${prop.toISOString().slice(0, 19).replace('T', ' ')}'`;
    } 
    return prop;
  }

  getName(): string{
    return this.name;
  }
}

import { ColumnInfo } from "./ColumnInfo"

export class RowEntity{
  private columns: ColumnInfo[];
  private __name: string;
  
  constructor(name: string){
    this.__name = name;
    this.init();
  }

  createNew(){
    let n = {};
    Object.getOwnPropertyNames(this).forEach( key => {
        if(typeof this[key] === 'function'){
          n[key] = this[key];
        }
    });
    return n;
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
    return this.__name;
  }
}

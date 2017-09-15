import { Table} from "./Table" 
import { ColumnInfo } from "./ColumnInfo";

export function Column(dataType: DataType, constraints?: Constraint | Constraint[]){
  return function(instance: Table, propName: string){
    console.log("cont", constraints);
    let c = constraints === undefined ? [] : [].concat(constraints);
    if(!(instance instanceof Table)){
      throw new TypeError("Cannot use Column decorator on property that is not in an instance of Table.") 
    }
    instance.addColumn(new ColumnInfo(propName, dataType, c)); 
  }
}

export enum DataType{
	INT,
	INTEGER,
	TINYINT,
	SMALLINT,
	MEDIUMINT,
	BIGINT,
	UNSIGNED_BIG_INT,
	INT2,
	INT8,
	CHARACTER,
	VARCHAR,
	VARYING_CHARACTER,
	NCHAR,
	NATIVE_CHARACTER,
	NVARCHAR,
	TEXT,
	CLOB,
	BLOB,
	NONE,
	REAL,
	DOUBLE,
	FLOAT,
	NUMERIC,
	DECIMAL,
	BOOLEAN,
	DATE,
	DATETIME
}

export enum Constraint {
  PRIMARY_KEY, 
  UNIQUE, 
  NOT_NULL, 
}

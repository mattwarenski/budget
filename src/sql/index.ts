import {DBFilter} from "./DBFilter"
import {DataBase} from "./DataBase"
import { Table } from "./Table";
import { Column, DataType, Constraint } from "./decorators";


class TestClass extends Table{
  constructor(){
    super("Test");
  }

  @Column(DataType.BIGINT, [Constraint.PRIMARY_KEY, Constraint.NOT_NULL])
  testInteger: number;
  @Column(DataType.INT)
  testNormalInt: number;
  @Column(DataType.DATETIME)
  date: Date;
}

class TestClass2 extends Table{
  constructor(){
    super("Test");
  }

  @Column(DataType.BIGINT, [Constraint.PRIMARY_KEY, Constraint.NOT_NULL])
  testInteger: number;
  @Column(DataType.INT)
  testNormalInt: number;
  @Column(DataType.INT)
  extraInt: number;
}

let tc = new TestClass();
let tc2 = new TestClass2();



let db = new DataBase("/home/mathew/testdb.sqlite", [tc,tc2]);
db.initDB(()=>{
  //console.log("db", db);
  console.log("tables", db.getTables());
  console.log("columns", db.getColumns(tc2)[0].values);
  tc.testInteger = 7;
  tc.testNormalInt = 4;
  tc.date = new Date();
  db.insert(tc);
  tc.testInteger = 3;
  tc.testNormalInt = 44;
  tc.date = new Date();
  tc.date.setFullYear(1880)
  db.insert(tc);
  let filterRow = new TestClass();
  filterRow.testInteger = 3;
  filterRow.testNormalInt = 44;
  let filter = new DBFilter();
  filter.earliestDate = new Date();
  filter.earliestDate.setFullYear(1998);
  filter.latestDate = new Date();
  filter.sortBy="testNormalInt";
  filter.dateField="date";
  filter.sortDesc = true;
  console.log("filter:", filter.getDateConstraints());
  console.log("Rows: ", db.getAllRows(TestClass))
  console.log("FILTER: ", db.getRows(filterRow, filter))
  console.log("No FILTER: ", db.getRows(new TestClass()))
  //db.writeDB();
});

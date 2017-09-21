import { Input, Component, OnInit } from '@angular/core';
import { Expense } from "../../model/expense";
import {DataTableModule,SharedModule} from 'primeng/primeng';
import { CurrencyPipe } from '@angular/common';
import { SqlService } from "../../services/sql.service";
import { DataBase } from "../../sql/DataBase";

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css']
})
export class ExpenseViewerComponent implements OnInit {

  expenses: Expense[];
  selectedRow;
  Date = Date;
  private accountId = 3;

  constructor(
    private sqlService: SqlService 
  ) { }

  onEditComplete(data){
    console.log('event happened', data); 
    this.sqlService.getDB().subscribe((db: DataBase)=> db.upsert(data))
  }

  ngOnInit() {
    this.sqlService.getDB().subscribe((db : DataBase)=>{
      this.expenses = db.getRows(new Expense())
      console.log("got", this.expenses);
    }); 
  }

  onRowClick(e:any) {
    this.selectedRow = e.data;
  }

  onAdd(){
    let newExpense = new Expense();
    newExpense.accountId = this.accountId;
    newExpense.amount = 0;
    newExpense.name = "none"
    newExpense.categoryId = 2;

    newExpense.date = this.expenses.length > 0 ? this.expenses[this.expenses.length - 1].date : new Date();
    this.expenses = [newExpense, ...this.expenses];
    this.sqlService.getDB().subscribe( db => db.upsert(newExpense ));
  }
}

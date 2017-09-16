import { Input, Component, OnInit } from '@angular/core';
import { Expense } from "../../model/expense";
import {DataTableModule,SharedModule} from 'primeng/primeng';
import { CurrencyPipe } from '@angular/common';
import { SqlService } from "../../services/sql.service";
import  {Table } from "ng2-sql.js"

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css']
})
export class ExpenseViewerComponent implements OnInit {

  expenses: Expense[];
  selectedRow;
  private accountId = 3;

  constructor(
    private sqlService: SqlService 
  ) { }

  onEditComplete(data){
    console.log('event happened', data); 
    this.sqlService.upsert("expenses", data);
  }

  ngOnInit() {
    this.expenses = this.sqlService.selectAll("expenses", Expense);
    //this.expenses.forEach( e => e.date = new Date());
    //this.expenses.forEach( e => this.sqlService.upsert("expenses", e))
  }

  onRowClick(e:any) {
    this.selectedRow = e.data;
  }

  onAdd(){
    let t = Table();
    console.log('adding');
    let newExpense = new Expense();
    newExpense.accountId = this.accountId;
    newExpense.amount = 0;
    newExpense.name = "none"
    newExpense.categoryId = 2;

    newExpense.date = this.expenses.length > 0 ? this.expenses[this.expenses.length - 1].date : new Date();
    this.sqlService.upsert("expenses", newExpense )
    this.expenses.push(newExpense);
  }
}

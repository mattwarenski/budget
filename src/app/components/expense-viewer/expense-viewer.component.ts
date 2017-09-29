import { Input, Component, OnInit } from '@angular/core';
import { Expense } from "../../model/expense";
import { Account } from "../../sql/Account";
import {DropdownModule, DataTableModule, SharedModule} from 'primeng/primeng';
import { CurrencyPipe } from '@angular/common';
import { SqlService } from "../../services/sql.service";
import { DataBase } from "../../sql/DataBase";
import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { ExpenseService } from "../../services/expense.service";

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css'],
  providers: [ExpenseService]
})
export class ExpenseViewerComponent implements OnInit {

  expenses: Expense[];
  selectedRow;
  categories;
  Date = Date;
  @Input() account: Account;

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) { }

  onEditComplete(data){
    this.expenseService.upsertRow(data);
  }

  ngOnInit() {
    let expenseModel = new Expense();
    expenseModel.accountId = this.account.id;
    this.expenseService.getAll(expenseModel).subscribe((expenses: Expense[])=>{
      this.expenses = expenses; 
    })

    this.categoryService.getAll().subscribe((categories: Category[]) => {
      this.categories = CategoryService.mapCategoriesForSelect(categories)
    });
  }

  onRowClick(e:any) {
    this.selectedRow = e.data;
  }

  onAdd(){
    let newExpense = new Expense();
    newExpense.accountId = this.account.id;
    newExpense.amount = 0;
    newExpense.name = "none"
    newExpense.categoryId = 2;

    newExpense.date = this.expenses.length > 0 ? this.expenses[this.expenses.length - 1].date : new Date();
    this.expenses = [newExpense, ...this.expenses];
    this.expenseService.upsertRow(newExpense);
  }

  onDelete(expense: Expense){
    this.expenseService.deleteRow(expense); 
  }
}

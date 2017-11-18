import { Input, Output, Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Expense } from "../../model/expense";
import { DropdownModule, DataTableModule, SharedModule } from 'primeng/primeng';
import { CurrencyPipe } from '@angular/common';
import { SqlService } from "../../services/sql.service";
import { DataBase } from "sqlite-base/DataBase";
import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { ExpenseService } from "../../services/expense.service";
import { Subscription } from "rxjs/Subscription";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Account } from '../../model/account';
import { DBFilter } from 'sqlite-base/DBFilter';
import * as moment from 'moment';

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css'],
  providers: [ExpenseService]
})
export class ExpenseViewerComponent implements OnInit, OnDestroy {
  expenseSubscription: Subscription;
  categorySubscription: Subscription;
  expenses: Expense[] = [];
  selectedRow;
  categories;
  editing: boolean;
  _displayMonth: Date;
  Date = Date;

  @Input() account: Account;

  @Input() set displayMonth(_displayMonth: Date){
    this._displayMonth = _displayMonth;
    this.getExpenses();
  };

  @Output() onTransaction = new EventEmitter();

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
  ) { }

  getExpenses(){
    let expenseModel = new Expense();
    expenseModel.accountId = this.account.id;
    let dbFilter = new DBFilter();
    dbFilter.earliestDate = moment(this._displayMonth).startOf('month').toDate();
    dbFilter.latestDate = moment(this._displayMonth).endOf('month').toDate();
    dbFilter.dateField = "date";

    if(this.expenseSubscription){
      this.expenseSubscription.unsubscribe();
    }

    this.expenseSubscription = this.expenseService.getAll(expenseModel, dbFilter).subscribe((expenses: Expense[])=>{
      //sort by date then id so that newest on is always on top
      let sorted = expenses.sort((a: Expense, b: Expense) => (+b.date) - (+a.date) || b.id - a.id);
      this.expenses = [];
      this.expenses = this.expenses.concat(sorted);
    });
  }

  onEditComplete(event){
    if(event.column && event.column.field === 'amount'){
      let total = this.expenses.reduce((total: number, expense: Expense)=>{
        return total + (+expense.amount);
      }, 0);
      this.onTransaction.emit(total); 
    }
    let data = event instanceof Expense ? event : event.data;
    this.expenseService.upsertRow(data);
  }

  ngOnInit() {
    this.getExpenses();
    this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[]) => {
      this.categories = [{'label' : 'Uncategorized', 'value' : 0}].concat(this.categoryService.getArrangedLabels());
    });
  }

  ngOnDestroy(){
    this.categorySubscription.unsubscribe();
    this.expenseSubscription.unsubscribe();
  }

  onRowClick(e:any) {
    this.selectedRow = e.data;
  }

  onAdd(){
    let newExpense = new Expense();
    newExpense.accountId = this.account.id;
    newExpense.amount = 0;
    newExpense.name = "none"
    newExpense.categoryId = 0;

    newExpense.date = this.expenses.length ? this.expenses[0].date : new Date();
    this.expenseService.upsertRow(newExpense);
  }

  onDelete(expense: Expense){
    this.expenseService.deleteRow(expense); 
  }

  findCategory(id: string){
    return this.categories.find( c => c.value === parseInt(id));
  }
}

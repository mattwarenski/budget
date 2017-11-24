import { Input, Output, Component, OnInit, OnDestroy } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router/src/shared';
import { Util } from '../../../util';
import { AccountService } from '../../services/account.service';
import { take } from 'rxjs/operator/take';

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css'],
  providers: [ExpenseService]
})
export class ExpenseViewerComponent implements OnInit, OnDestroy {
  expenseSubscription: Subscription;
  categorySubscription: Subscription;
  accountSubscription: Subscription;
  expenses: Expense[] = [];
  selectedRow;
  categories;
  editing: boolean;
  Date = Date;
  accountId: number;
  displayMonth: Date;
  account: Account;

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  getExpenses(){
    let expenseModel = new Expense();
    expenseModel.accountId = this.accountId;
    let dbFilter = new DBFilter();
    dbFilter.earliestDate = moment(this.displayMonth).startOf('month').toDate();
    dbFilter.latestDate = moment(this.displayMonth).endOf('month').toDate();
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

  getTotal(){
    return Util.sumExpenses(this.expenses);
  }

  onEditComplete(event){
    if(event.column && event.column.field === 'amount'){
      let total = this.expenses.reduce((total: number, expense: Expense)=>{
        return total + (+expense.amount);
      }, 0);
      //TODO: update the total 
    }
    let data = event instanceof Expense ? event : event.data;
    this.expenseService.upsertRow(data);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.accountId = params['accountId']
        this.getExpenses();
        this.getAccount();
        this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[]) => {
          this.categories = [{'label' : 'Uncategorized', 'value' : 0}].concat(this.categoryService.getArrangedLabels());
        });
      })
  }

  getAccount(){
    if(this.accountId){
      let filter = new Account();
      filter.id = this.accountId;
      if(this.accountSubscription){
        this.accountSubscription.unsubscribe(); 
      }
      this.accountSubscription = this.accountService.getAll(filter).subscribe((accounts: Account[]) => {
        if(accounts.length){
          this.account = accounts[0];
        }  
      });
    }
  }

  ngOnDestroy(){
    this.categorySubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.expenseSubscription.unsubscribe();
  }

  onRowClick(e:any) {
    this.selectedRow = e.data;
  }

  onAdd(){
    let newExpense = new Expense();
    newExpense.accountId = this.accountId
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

  onSelectedMonthChange(date: Date){
    this.displayMonth =  date; 
    this.getExpenses();
  }
}

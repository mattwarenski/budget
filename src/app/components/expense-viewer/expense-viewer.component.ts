import { Term } from '../../model/budgetTerm';
import { Input, Output, Component, OnInit } from '@angular/core';
import { Expense } from "../../model/expense";
import { DropdownModule, DataTableModule, SharedModule } from 'primeng/primeng';
import { CurrencyPipe } from '@angular/common';
import { SqlService } from "../../services/sql.service";
import { DataBase } from "sqlite-base/DataBase";
import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { ExpenseService } from "../../services/expense.service";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Account } from '../../model/account';
import { DBFilter } from 'sqlite-base/DBFilter';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router/src/shared';
import { Util } from '../../../util';
import { AccountService } from '../../services/account.service';
import { TermUtils } from '../../model/budgetTerm';
import { IdCounterService } from '../../services/id-counter.service';

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css']
})
export class ExpenseViewerComponent implements OnInit {
  expenses: Expense[] = [];
  selectedRow;
  categories;
  editing: boolean;
  Date = Date;
  accountId: number;
  displayMonth: Date;
  account: Account;
  categoryId: number;
  category: Category;

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private idCounterService: IdCounterService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.accountId = params['accountId']
        this.categoryId = params['categoryId'];
        let month = params['month'];
        if(month){
          this.displayMonth = new Date(month);
        }

        let categories = this.categoryService.getAll();
        if(this.categoryId){
          this.category = categories.find(c =>  c.id === +this.categoryId);  
        }
        this.categories = [{'label' : 'Uncategorized', 'value' : 0}].concat(this.categoryService.getArrangedLabels(categories));
      });

    this.getExpenses();
    //this.expenses.forEach((ex: Expense) => {
      //let id = this.idCounterService.getNextSplitId();
      //ex.splitId = id;
      //this.expenseService.upsertRow(ex);
    //});
    this.getAccount();
  }

  getExpenses(){
    let expenseModel = new Expense();
    if(this.accountId){
      expenseModel.accountId = this.accountId;
    }
    if(this.categoryId){
      expenseModel.categoryId = this.categoryId;
    }
    let dbFilter = new DBFilter();
    if(this.category && this.category.term == Term.OneTime){
      dbFilter.earliestDate = this.category.rollOverStartDate;
      dbFilter.latestDate = new Date();
    } else{
      dbFilter.earliestDate = TermUtils.getMonthStart(this.displayMonth);
      dbFilter.latestDate = TermUtils.getMonthEnd(this.displayMonth);
    }
    dbFilter.dateField = "date";


    //sort by date then id so that newest on is always on top
    this.expenses = this.expenseService
      .getAll(expenseModel, dbFilter)
      .sort((a: Expense, b: Expense) => (+b.date) - (+a.date) || b.id - a.id);
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

  getHeader(){
    if(this.accountId && this.account){
      return this.account.name;
    } 
    if(this.category){
      return this.category.name; 
    }
    return "Expenses";
  }

  getAccount(){
    if(this.accountId){
      let filter = new Account();
      filter.id = this.accountId;
      let accounts = this.accountService.getAll(filter);
      if(accounts.length){
        this.account = accounts[0];
      }  
    }
  }

  onRowClick(e:any) {
    this.selectedRow = e.data;
  }

  onSplit(splitExpense: Expense){
    let newExpense = new Expense();
    newExpense.amount = 0;
    newExpense.splitId = splitExpense.splitId;
    newExpense.date = splitExpense.date;
    newExpense.name = splitExpense.name;
    newExpense.accountId = splitExpense.accountId;
    this.saveExpense(newExpense);
  }

  saveExpense(expense: Expense){
    this.expenseService.upsertRow(expense);
    this.getExpenses();
  }

  onAdd(splitExpense?: Expense){
    let newExpense = new Expense();
    newExpense.accountId = this.accountId
    newExpense.amount = 0;
    newExpense.name = "none"
    newExpense.categoryId = 0;
    newExpense.splitId =  this.idCounterService.getNextSplitId(); 

    newExpense.date = this.expenses.length ? this.expenses[0].date : new Date();
    this.saveExpense(newExpense);
  }

  onDelete(expense: Expense){
    this.expenseService.deleteRow(expense); 
    this.getExpenses();
  }

  findCategory(id: string){
    let cat = this.categories.find( c => c.value === parseInt(id));
    return cat ? cat : this.categories[0];
  }

  onSelectedMonthChange(date: Date){
    this.displayMonth =  date; 
    this.getExpenses();
  }
}

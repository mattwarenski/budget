import { Input, Output, Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Expense } from "../../model/expense";
import { Account } from "../../sql/Account";
import { DropdownModule, DataTableModule, SharedModule } from 'primeng/primeng';
import { CurrencyPipe } from '@angular/common';
import { SqlService } from "../../services/sql.service";
import { DataBase } from "../../sql/DataBase";
import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { ExpenseService } from "../../services/expense.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-expense-viewer',
  templateUrl: './expense-viewer.component.html',
  styleUrls: ['./expense-viewer.component.css'],
  providers: [ExpenseService]
})
export class ExpenseViewerComponent implements OnInit, OnDestroy {
  expenseSubscription: Subscription;
  categorySubscription: Subscription;
  expenses: Expense[];
  selectedRow;
  categories;
  editing: boolean;
  Date = Date;
  @Input() account: Account;
  @Output() onTransaction = new EventEmitter();

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) { }

  onEditComplete(event){
    this.expenseService.upsertRow(event.data);
    if(event.column.field === 'amount'){
      let total = this.expenses.reduce((total: number, expense: Expense)=>{
        return total + (+expense.amount);
      }, 0);
      this.onTransaction.emit(total); 
      this.categoryService.updateTotal(event.data.categoryId)
    }
  }

  ngOnInit() {
    let expenseModel = new Expense();
    expenseModel.accountId = this.account.id;
    this.expenseSubscription = this.expenseService.getAll(expenseModel).subscribe((expenses: Expense[])=>{
      this.expenses = expenses; 
      console.log("expenses updated", this.expenses);
    });

    this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[]) => {
      this.categories = [{'label' : 'Uncategorized', 'value' : 0}].concat(CategoryService.mapCategoriesForSelect(categories));
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

    newExpense.date = this.expenses.length > 0 ? this.expenses[this.expenses.length - 1].date : new Date();
    this.expenseService.upsertRow(newExpense);
  }

  onDelete(expense: Expense){
    this.expenseService.deleteRow(expense); 
  }
}

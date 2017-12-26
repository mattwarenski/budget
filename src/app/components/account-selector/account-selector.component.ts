import { Account } from '../../model/account';
import { AccountService } from "../../services/account.service";
import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { SafeCurrencyPipe } from '../../pipes/safe-currency.pipe';
import { Router } from '@angular/router';
import { Util } from '../../../util';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../model/expense';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  providers: [ExpenseService]
})
export class AccountSelectorComponent implements OnInit {
  accounts: Account[];
  selectedAccount: Account;
  editing: boolean;
  selectedDate: Date;
  accountTotals = {};

  constructor(
    private accountService: AccountService,
    private expenseService: ExpenseService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log("initializing");
    this.accounts = this.accountService.getAll();
    this.accounts.forEach( (account: Account) => {
        let filter = new Expense();
        filter.accountId = account.id;
        this.accountTotals[account.id] = this.expenseService.getExpenseSum(filter);
      });
  }

  onEditComplete(data){
    this.accountService.upsertRow(data);
  }

  onRowClick(account: Account){
    this.router.navigate(['/expenses'], { queryParams: {
      accountId : account.id,
      showMonthSelect : true
    }})
    this.editing = false;
  }

  onAdd(){
    let newAccount = new Account();
    newAccount.name = "New Account"
    newAccount.balance = 0;
    newAccount.bank = "New Bank"

    this.accounts = [newAccount, ...this.accounts];
    this.accountService.upsertRow(newAccount);
  }

  onDelete(expense: Account){
    this.accountService.deleteRow(expense); 
  }
}

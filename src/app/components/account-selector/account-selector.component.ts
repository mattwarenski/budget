import { Account } from '../../model/account';
import { AccountService } from "../../services/account.service";
import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { OnDestroy } from "@angular/core";
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
export class AccountSelectorComponent implements OnInit, OnDestroy {
  accounts: Account[];
  selectedAccount: Account;
  editing: boolean;
  accountSubscription: Subscription
  selectedDate: Date;
  accountTotals = {};

  constructor(
    private accountService: AccountService,
    private expenseService: ExpenseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.accountSubscription = this.accountService.getAll().subscribe((accounts: Account[])=>{
      this.accounts = accounts;
      this.accounts.forEach( (account: Account) => {
        let filter = new Expense();
        filter.accountId = account.id;
        this.expenseService.getAll(filter).take(1).subscribe((expenses => {
          this.accountTotals[account.id] = Util.sumExpenses(expenses); 
        }))
      });
    });
  }

  ngOnDestroy(){
    this.accountSubscription.unsubscribe(); 
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

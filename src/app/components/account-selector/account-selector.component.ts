import { Account } from '../../model/account';
import { AccountService } from "../../services/account.service";
import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { SafeCurrencyPipe } from '../../pipes/safe-currency.pipe';
import { Router } from '@angular/router';
import { Util } from '../../../util';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../model/expense';

import * as moment from 'moment';
import { IdCounterService } from '../../services/id-counter.service';
const electron = window.require('electron')
const fs = window.require('fs');

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
    private router: Router,
    private idCounterService: IdCounterService
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

  onFileUpload(e, account: Account){
    console.log("e", e)
    e.preventDefault();
    e.stopPropagation();
    const filename = electron.remote.dialog.showOpenDialog({properties: ['openFile']});
    if(filename && filename.length){
      console.log("opening file", filename[0]);
      const file = fs.readFileSync(filename[0]).toString();
      console.log("file", file);
      file.split('\n')
        .slice(1)
        .map( l => l.split(',"').map( p => p.replace('"', '')))
        .map( line => {
          const expense = new Expense();
          //expense.accountId = selected account id
          expense.accountId = account.id;
          expense.amount = parseFloat(line[4]);
          expense.date = moment(line[2], "MM-DD-YYYY").toDate();
          expense.name = line[7];
          expense.splitId = this.idCounterService.getNextSplitId(); 
          return expense;
        })
        .filter( expense => expense.amount || expense.amount === 0)
        //.forEach( expense => console.log(expense));
        .forEach( expense => this.expenseService.upsertRow(expense));

    } 
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

import { Account } from '../../model/account';
import { AccountService } from "../../services/account.service";
import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { OnDestroy } from "@angular/core";
import { SafeCurrencyPipe } from '../../pipes/safe-currency.pipe';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
})
export class AccountSelectorComponent implements OnInit, OnDestroy {
  accounts: Account[];
  selectedAccount: Account;
  editing: boolean;
  accountSubscription: Subscription

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountSubscription = this.accountService.getAll().subscribe((accounts: Account[])=>{
      this.accounts = accounts;
    });
  }

  ngOnDestroy(){
    this.accountSubscription.unsubscribe(); 
  }

  onEditComplete(data){
    this.accountService.upsertRow(data);
  }

  onRowClick(account: Account){
    this.selectedAccount = account; 
    this.editing = false;
  }

  //When a new amount is received from the expense emitter
  onAccountAmmount(amount){
    this.selectedAccount.balance = amount;
    this.accountService.upsertRow(this.selectedAccount);
  }

  getAccountHeader(){
    let total = this.accounts.reduce((total: number, current: Account) => total + (+current.balance), 0);
    total = new SafeCurrencyPipe().transform(total);
    return `Accounts: ${total}` 
  }

  getExpenseHeader(){
    let formattedBallance = new SafeCurrencyPipe().transform(this.selectedAccount.balance);
    return `${this.selectedAccount.name}: ${formattedBallance}` 
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

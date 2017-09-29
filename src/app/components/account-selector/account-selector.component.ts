import { AccountService } from "../../services/account.service";
import { Component, OnInit } from '@angular/core';
import { Account } from "../../sql/Account";
import { Subscription } from "rxjs/Subscription";
import { OnDestroy } from "@angular/core";

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
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
    console.log("clicked", account);
    this.selectedAccount = account; 
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

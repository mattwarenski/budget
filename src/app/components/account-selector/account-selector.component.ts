import { AccountService } from "../../services/account.service";
import { Component, OnInit } from '@angular/core';
import { Account } from "../../sql/Account";

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent implements OnInit {
  accounts: Account[];
  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.getAll().subscribe((accounts: Account[])=>{
      this.accounts = accounts;
    });
  }

  onEditComplete(data){
    this.accountService.upsertRow(data);
  }

  onRowClick(account: Account){
  
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

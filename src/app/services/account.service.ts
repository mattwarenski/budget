import { Injectable } from '@angular/core';
import { AbstractTableService } from "./abstractTable.service";
import { SqlService } from "./sql.service";
import { Account } from '../model/account';
import { Router } from '@angular/router';

@Injectable()
export class AccountService extends AbstractTableService<Account> {

  constructor(private __sqlService: SqlService, private router: Router) {
    super(Account, __sqlService, router);
  }
}

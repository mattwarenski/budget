import { Injectable } from '@angular/core';
import { AbstractTableService } from "./abstractTable.service";
import { SqlService } from "./sql.service";
import { Account } from '../model/account';

@Injectable()
export class AccountService extends AbstractTableService<Account> {

  constructor(private __sqlService: SqlService) {
    super(Account, __sqlService);
  }

}

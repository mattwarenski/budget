import { Injectable } from '@angular/core';
import { Account } from "../sql/Account";
import { AbstractTableService } from "./abstractTable.service";
import { SqlService } from "./sql.service";

@Injectable()
export class AccountService extends AbstractTableService<Account> {

  constructor(private __sqlService: SqlService) {
    super(Account, __sqlService);
  }

}

import { Injectable } from '@angular/core';
import { SqlService } from "./sql.service";
import { Expense } from "../model/expense";
import { AbstractTableService } from "./abstractTable.service";
import { Router } from '@angular/router';
import { DBFilter } from 'sqlite-base/DBFilter';

@Injectable()
export class ExpenseService extends AbstractTableService<Expense>{

  constructor(private __sqlService: SqlService, private router: Router) {
    super(Expense, __sqlService, router);
  }

  getExpenseSum(filter?: Expense, dbFilter?: DBFilter): number{
    return super.getSum('amount', filter, dbFilter);
  }
}

import { Injectable } from '@angular/core';
import { SqlService } from "./sql.service";
import { Expense } from "../model/expense";
import { AbstractTableService } from "./abstractTable.service";

@Injectable()
export class ExpenseService extends AbstractTableService<Expense>{

  constructor(private __sqlService: SqlService) {
    super(Expense, __sqlService);
  }

}

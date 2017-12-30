import { Injectable } from '@angular/core';
import { SqlService } from "./sql.service";
import { Expense } from "../model/expense";
import { AbstractTableService } from "./abstractTable.service";
import { Router } from '@angular/router';
import { DBFilter } from 'sqlite-base/DBFilter';
import * as moment from 'moment';
import { TermUtils } from '../model/budgetTerm';

@Injectable()
export class ExpenseService extends AbstractTableService<Expense>{

  constructor(private __sqlService: SqlService, private router: Router) {
    super(Expense, __sqlService, router);
  }

  getExpenseSum(filter?: Expense, dbFilter?: DBFilter): number{
    return super.getSum('amount', filter, dbFilter);
  }

  private monthFilter(month: Date){
    let earliestDate = moment(TermUtils.getMonthStart(month)).format("YYYY-MM-DD");
    let latestDate = moment(TermUtils.getMonthEnd(month)).format("YYYY-MM-DD");
    return `date >= '${earliestDate}' AND date <= '${latestDate}'`
  }

  getSpentInMonth(month: Date){
    const where = `amount < 0 AND ${this.monthFilter(month)}`;
    return this.db.sumWithWhere(new Expense(),'amount', where );
  }
  getEarnedInMonth(month: Date){
    const where = `amount > 0 AND ${this.monthFilter(month)}`;
    return this.db.sumWithWhere(new Expense(),'amount', where);
  }
}

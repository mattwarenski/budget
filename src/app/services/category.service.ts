import { Subject } from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import { SqlService } from "./sql.service";
import { DataBase } from "../sql/DataBase";
import { AbstractTableService } from "./abstractTable.service";
import { Expense } from "../model/expense";
import { TermUtils } from '../model/budgetTerm';
import { DBFilter } from '../sql/DBFilter';

@Injectable()
export class CategoryService extends AbstractTableService<Category> {
  db: DataBase;


  constructor(private __sqlService: SqlService) {
    super(Category, __sqlService);
  }

  static mapCategoriesForSelect(categories: Category[]): any[]{
    return categories.map(c => {
      return { label : c.name, "value": c.id }
    });
  }

  getTotal(category: Category, termDelta: number): Promise<number> {
    return new Promise((resolve)=>{
      if(!this.db){
        this.__sqlService.getDB(
          (db: DataBase)=> {
            this.db = db;
            let total = this.calculateTotal(category);
            resolve(total);
          });
      }
      else{
        let total = this.calculateTotal(category);
        resolve(total);
      }
    });
  }

  private calculateTotal(category: Category): number{
    let dbFilter = new DBFilter();
    dbFilter.earliestDate = TermUtils.getTermStartDate(category.term);
    dbFilter.latestDate = TermUtils.getTermEndDate(category.term);
    dbFilter.dateField = "date";
    console.log(dbFilter);

    let expense = new Expense();
    expense.categoryId = category.id;
    return this.db.getRows(expense, dbFilter)
      .reduce((total: number, current: Expense)=> total + (+current.amount), 0);

  }
}

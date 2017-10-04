import { Subject } from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import { SqlService } from "./sql.service";
import { DataBase } from "../sql/DataBase";
import { AbstractTableService } from "./abstractTable.service";
import { Expense } from "../model/expense";

@Injectable()
export class CategoryService extends AbstractTableService<Category> {
  constructor(private __sqlService: SqlService) {
    super(Category, __sqlService);
  }

  static mapCategoriesForSelect(categories: Category[]): any[]{
    return categories.map(c => {
      return { label : c.name, "value": c.id }
    });
  }

  updateTotal(categoryId: number){
    this.__sqlService.getDB(
      (db: DataBase)=> {
      let filter = new Expense();
      filter.categoryId = categoryId;
      let total = db.getRows(filter).reduce((total: number, current: Expense)=> total + (+current.amount),0);  
      let category = this.entities.find( e => e.id === categoryId);
      category.total = total;
      this.upsertRow(category);
    });
  }
}

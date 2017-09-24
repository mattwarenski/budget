import { Subject } from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import { SqlService } from "./sql.service";
import { DataBase } from "../sql/DataBase";
import { AbstractTableService } from "./abstractTable.service";

@Injectable()
export class CategoryService extends AbstractTableService<Category> {
  constructor(private __sqlService: SqlService) {
    super(Category, __sqlService);
  }

  static mapCategoriesForSelect(categories: Category[]): any[]{
    return categories.map(c => {
      return { label : c.name,
        "value": c.id
      }
    });
  }
}

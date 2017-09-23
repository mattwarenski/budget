import { Subject } from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import { SqlService } from "./sql.service";
import { DataBase } from "../sql/DataBase";

@Injectable()
export class CategoryService {
  categories: Category[] = [];
  private currentCategories: Subject<Category[]>;


  constructor(private sqlService: SqlService) {
    this.currentCategories = new Subject<Category[]>(); 
    this.sqlService.getDB().subscribe(
      db => {
        //concat so if the array is modified before this returns no changes are lost
        this.categories = db.getRows(new Category()).concat(this.categories); 
        this.currentCategories.next(this.categories);
      }); 
  }

  getCategories(): Subject<Category[]>{
    return this.currentCategories;  
  }

  addCategory(newCategory: Category): void{
    this.sqlService.getDB().subscribe(
      (db: DataBase) => {
        db.upsert(newCategory);
        this.categories.push(newCategory);
        this.currentCategories.next(this.categories);
      });
  }
}

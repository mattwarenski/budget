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

  upsertCategory(category: Category): void{
    this.sqlService.getDB().subscribe(
      (db: DataBase) => {
        let currentIndex = this.categories.findIndex( c => c.id === category.id); 
        if(currentIndex < 0){
          this.categories.push(category);
        }
        else{
          this.categories[currentIndex] = category; 
        }
        db.upsert(category);
        this.currentCategories.next(this.categories);
      });
  }

  deleteCategory(category: Category): void{
    this.sqlService.getDB().subscribe(
      (db: DataBase) => {
        db.deleteRow(category);
        let index = this.categories.findIndex( c => category.id === c.id);
        this.categories.splice(index, 1);
        this.currentCategories.next(this.categories);
      });
  }

  static mapCategoriesForSelect(categories: Category[]): any[]{
    return categories.map(c => {
      return { label : c.getName(),
        name: c.getName(),
        "value": c.id
      }
    });
  }
}

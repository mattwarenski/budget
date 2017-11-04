import { Subject } from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import { SqlService } from "./sql.service";
import { DataBase } from "sqlite-base/DataBase";
import { AbstractTableService } from "./abstractTable.service";
import { Expense } from "../model/expense";
import { TermUtils } from '../model/budgetTerm';
import { DBFilter } from 'sqlite-base/DBFilter';
import * as moment from 'moment';

@Injectable()
export class CategoryService extends AbstractTableService<Category> {
  db: DataBase;


  constructor(private __sqlService: SqlService) {
    super(Category, __sqlService);
  }

  /**
   * Returns category labels with parents sorted alphabetically and children sorted alphabetically after them
   */
  arrangeCategories(){
    let childCategories = {};
    this.entities.forEach((category: Category)=>{
      if(category.parentId){
        childCategories[category.parentId] ? childCategories[category.parentId].push(category) : childCategories[category.parentId] = [category];
      }  
    });

    let parentCategories =  this.sortAlphabetically(this.entities.filter(
      (category: Category)=> !category.parentId && category.id));


   let categories = [];
   parentCategories.forEach((c: Category)=>{
     categories.push({ label : c.name, "value": c.id, parent : true})
     if(childCategories[c.id]){
         let sorted = this.sortAlphabetically(childCategories[c.id])
           .forEach( child => categories.push({ label : child.name, "value": child.id })) 
     }
   });
    return categories;
  }

  private sortAlphabetically(catArr: Category[]){
    return catArr.sort(function(a, b){
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    })
  }

  getRolloverTotal(category: Category): number{
    let today = new Date();
    if(category.rollOverStartDate > today){
      console.error("Cannot determine roll over total for category. Start date in future", category);
    }
    //total from start until today
    let total = this.calculateTotalByDate(category, category.rollOverStartDate, null); 
    //1 for the current month since the current date - the current month would be 0
    let numMonths = moment(today).diff(category.rollOverStartDate, 'months') + 1;
    return (numMonths * category.budgetAmount) + total;
  }

  getTotal(category: Category, termDelta = 0): Promise<number> {
    return new Promise((resolve)=>{
      if(!this.db){
        this.__sqlService.getDB(
          (db: DataBase)=> {
            this.db = db;
            let total = this.calculateTotalByTerm(category, termDelta);
            resolve(total);
          });
      }
      else{
        let total = this.calculateTotalByTerm(category, termDelta);
        resolve(total);
      }
    });
  }

  private calculateTotalByTerm(category: Category, termDelta: number): number{
    let earliestDate = TermUtils.getTermStartDate(category.term);
    let latestDate = TermUtils.getTermEndDate(category.term);
    return this.calculateTotalByDate(category, earliestDate, latestDate);
  }

  private calculateTotalByDate(category: Category, earliestDate: Date, latestDate: Date): number{
    let dbFilter = new DBFilter();
    dbFilter.earliestDate = earliestDate;
    dbFilter.latestDate = latestDate;
    dbFilter.dateField = "date";

    let expense = new Expense();
    expense.categoryId = category.id;

    return this.db.getRows(expense, dbFilter)
      .reduce((total: number, current: Expense)=> total + (+current.amount), 0);
  }
}

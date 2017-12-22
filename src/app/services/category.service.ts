import { Subject } from "rxjs/Subject";
import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import { SqlService } from "./sql.service";
import { DataBase } from "sqlite-base/DataBase";
import { AbstractTableService } from "./abstractTable.service";
import { Expense } from "../model/expense";
import { TermUtils, Term } from '../model/budgetTerm';
import { DBFilter } from 'sqlite-base/DBFilter';
import * as moment from 'moment';
import { Util } from '../../util';

@Injectable()
export class CategoryService extends AbstractTableService<Category> {

  private parentMap: any;


  constructor(private __sqlService: SqlService) {
    super(Category, __sqlService);
  }

  getAllAranged(){
    let childCategories = {};
    this.parentMap = {};
    this.entities.forEach((category: Category)=>{
      if(category.parentId){
        childCategories[category.parentId] ? childCategories[category.parentId].push(category) : childCategories[category.parentId] = [category];
      }  
    });

    let parentCategories =  this.sortAlphabetically(this.entities.filter(
      (category: Category)=> !category.parentId && category.id));


   let categories = [];
   parentCategories.forEach((c: Category)=>{
     categories.push(c)
     this.parentMap[c.id] = [];
     if(childCategories[c.id]){
         let sorted = this.sortAlphabetically(childCategories[c.id])
         .forEach( child =>{
           categories.push(child);
           this.parentMap[c.id].push(child)
         });
     }
   });

    return categories;
  }

  /**
   * Returns category labels with parents sorted alphabetically and children sorted alphabetically after them
   */
  getArrangedLabels(){
    return this.getAllAranged().map((cat : Category) => {
      if(cat.parentId){
        return { label : cat.name, "value": cat.id }
      } 
      return { label : cat.name, "value": cat.id, parent : true};
    })
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

  private getCategoryTotal(category: Category, startDate: Date): Promise<number>{
    return new Promise((resolve)=>{
      if(!this.db){
        this.__sqlService.getDB(
          (db: DataBase)=> {
            this.db = db;
            let total = this.calculateTotalByTerm(category, startDate);
            resolve(total);
          });
      }
      else{
        let total = this.calculateTotalByTerm(category, startDate);
        resolve(total);
      }
    });
  
  }

  getTotal(startCategory: Category, startDate: Date): Promise<number> {
    //if there is no parent map, get it
    if(!startCategory.parentId && this.parentMap){
      this.getAllAranged(); 
      return new Promise((resolve)=>{
        Promise.all(
          this.parentMap[startCategory.id]
          .map( c => this.getCategoryTotal(c, startDate))
          .concat(this.getCategoryTotal(startCategory, startDate))
        ).then( (totals: any[]) => {
          let total = Util.sumExpenses(totals);
          resolve(total);
        });
      })
    }
    else{
      return this.getCategoryTotal(startCategory, startDate);
    }
       
  }

  private calculateTotalByTerm(category: Category, startDate: Date): number{
    let earliestDate;
    let latestDate;
    if(category.term == Term.Monthly){
      earliestDate = TermUtils.getMonthStart(startDate);
      latestDate = TermUtils.getMonthEnd(startDate);
    }
    else{
      //TODO: potentially refactor in future to take start date as the beginning of the term
      earliestDate = category.rollOverStartDate;
      latestDate = new Date();
      //console.log("calculating", category.name, "with terms", earliestDate, "to", latestDate);
    }
    return this.calculateTotalByDate(category, earliestDate, latestDate);
  }

  private calculateTotalByDate(category: Category, earliestDate: Date, latestDate: Date): number{
    let dbFilter = new DBFilter();
    dbFilter.earliestDate = earliestDate;
    dbFilter.latestDate = latestDate;
    dbFilter.dateField = "date";

    let expense = new Expense();
    expense.categoryId = category.id;

    return Util.sumExpenses(this.db.getRows(expense, dbFilter));
  }
}

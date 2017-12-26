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
import { Router } from '@angular/router';

@Injectable()
export class CategoryService extends AbstractTableService<Category> {

  constructor(private __sqlService: SqlService, private router: Router) {
    super(Category, __sqlService, router);
  }

  getAllAranged(categories: Category[]){
    return this.getMapAndCategoriesArranged(categories)[0];
  }

  private getMapAndCategoriesArranged(entities: Category[]): [any[], any]{
    let childCategories = {};
    let parentMap = {};
    entities.forEach((category: Category)=>{
      if(category.parentId){
        childCategories[category.parentId] ? childCategories[category.parentId].push(category) : childCategories[category.parentId] = [category];
      }  
    });

    let parentCategories =  this.sortAlphabetically(entities.filter(
      (category: Category)=> !category.parentId && category.id));


   let categories = [];
   parentCategories.forEach((c: Category)=>{
     categories.push(c)
     parentMap[c.id] = [];
     if(childCategories[c.id]){
         let sorted = this.sortAlphabetically(childCategories[c.id])
         .forEach( child =>{
           categories.push(child);
           parentMap[c.id].push(child)
         });
     }
   });

    return [categories, parentMap];
  }

  /**
   * Returns category labels with parents sorted alphabetically and children sorted alphabetically after them
   */
  getArrangedLabels(entities: Category[]){
    return this.getAllAranged(entities).map((cat : Category) => {
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
    let total = this.getTotalWithDates(category, category.rollOverStartDate, null); 
    //1 for the current month since the current date - the current month would be 0
    let numMonths = moment(today).diff(category.rollOverStartDate, 'months') + 1;
    return (numMonths * category.budgetAmount) + total;
  }

  getTotal(startCategory: Category, startDate: Date): number {
    //if there is no parent map, get it
    if(!this.isValidDate(startDate)){
      startDate = new Date(); 
    }

    let earliestDate;
    let latestDate;
    if(startCategory.term == Term.Monthly){
      earliestDate = TermUtils.getMonthStart(startDate);
      latestDate = TermUtils.getMonthEnd(startDate);
    }
    else{
      //TODO: potentially refactor in future to take start date as the beginning of the term
      if(this.isValidDate(startCategory.rollOverStartDate)){
        earliestDate = startCategory.rollOverStartDate;
      }
      else{
        earliestDate = TermUtils.getMonthStart(new Date()); 
      }
      latestDate = new Date();
    }

    return this.getTotalWithDates(startCategory, earliestDate, latestDate);
  }

  private getTotalWithDates(category: Category, earliestDate: Date, latestDate: Date): number{
    let dbFilter = new DBFilter();
    dbFilter.earliestDate = earliestDate;
    dbFilter.latestDate = latestDate;
    dbFilter.dateField = "date";
    let filter = new Expense();
    let amount = 0;
    if(!category.parentId){
      let childCategoryFilter = new Category();
      childCategoryFilter.parentId = category.id;
      let children = this.db.getRows(childCategoryFilter);
      children.forEach(child=>{
        filter.categoryId = child.id;
        amount += this.db.sum(filter, 'amount', dbFilter); 
      })
    }

    filter.categoryId = category.id;
    return this.db.sum(filter, 'amount', dbFilter);
  }

  private isValidDate(date: Date): boolean{
    return date && date instanceof Date && date.toString() !== 'Invalid Date'; 
  }
}

import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { Term } from '../../model/budgetTerm';

@Component({
  selector: 'app-budget-percentage-viewer',
  templateUrl: './budget-percentage-viewer.component.html',
  styleUrls: ['./budget-percentage-viewer.component.css']
})
export class BudgetPercentageViewerComponent implements OnInit {

  categorySubscription: Subscription;
  categoryMetadata: any[];
  selectedDate: Date;

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.getTotals();
  }

  getTotals(){
    if(this.categorySubscription){
      this.categorySubscription.unsubscribe(); 
    }
    if(!this.selectedDate){
      this.selectedDate = new Date(); 
    }

    this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[])=>{
      categories = this.categoryService.getAllAranged();
      Promise.all(categories.map( category => this.categoryService.getTotal(category, this.selectedDate)))
        .then( totals =>{
          this.categoryMetadata = totals.map( (total, index) => {
            return  { 'title' : categories[index].name,
              'total' : categories[index].budgetAmount,
              'amount' :  -total ,
              'isOneTime' : categories[index].term == Term.OneTime,
              'isParent' : (!categories[index].parentId ? true : false), 
              'id' : categories[index].id
            };
          });
        });
    });
  }

  onSelectedMonthChange(selectedDate: Date){
    this.selectedDate = selectedDate; 
    this.getTotals();
  }
}

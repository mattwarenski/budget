import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';
import * as moment from 'moment';
import { Term } from '../../model/budgetTerm';

@Component({
  selector: 'app-budget-percentage-viewer',
  templateUrl: './budget-percentage-viewer.component.html',
  styleUrls: ['./budget-percentage-viewer.component.css']
})
export class BudgetPercentageViewerComponent implements OnInit {

  categoryMetadata: any[];
  selectedDate: Date;

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.getTotals();
  }

  getTotals(){
    if(!this.selectedDate){
      this.selectedDate = new Date(); 
    }

    let categories = this.categoryService.getAll();
    this.categoryMetadata = this.categoryService.getAllAranged(categories)
      .map( category => {
            let total = this.categoryService.getTotal(category, this.selectedDate);
            return  { 'title' : category.name,
              'total' : category.budgetAmount,
              'amount' :  -total ,
              'isOneTime' : category.term == Term.OneTime,
              'isRollover' : category.isRollover ? true : false,
              'isParent' : (!category.parentId ? true : false), 
              'id' : category.id
            };
      });
  }

  onSelectedMonthChange(selectedDate: Date){
    this.selectedDate = selectedDate; 
    this.getTotals();
  }
}

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

  selectedDate: Date;
  categories: Category[]

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    if(!this.selectedDate){
      this.selectedDate = new Date(); 
    }
    this.categories = this.categoryService.getAllAranged(this.categoryService.getAll());
  }

  onSelectedMonthChange(selectedDate: Date){
    this.selectedDate = selectedDate; 
    //hack: reassign so change detection updates
    this.categories = this.categoryService.getAllAranged(this.categoryService.getAll());
  }
}

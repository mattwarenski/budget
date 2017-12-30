import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';
import * as moment from 'moment';
import { Term } from '../../model/budgetTerm';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-budget-percentage-viewer',
  templateUrl: './budget-percentage-viewer.component.html',
  styleUrls: ['./budget-percentage-viewer.component.css']
})
export class BudgetPercentageViewerComponent implements OnInit {

  selectedDate: Date;
  categories: Category[]
  totalBudgeted: number;
  totalMonthlyBudgeted: number;
  positiveRollover: number;
  negativeRollover: number;
  spentInMonth: number;
  earnedInMonth: number;

  constructor(
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit() {
    if(!this.selectedDate){
      this.selectedDate = new Date(); 
    }
    this.updateTotals();
  }

  onSelectedMonthChange(selectedDate: Date){
    this.selectedDate = selectedDate; 
    this.updateTotals();
  }

  updateTotals(){
    //hack: reassign so change detection updates
    this.categories = this.categoryService.getAllAranged(this.categoryService.getAll());
    this.totalBudgeted = this.categoryService.getTotalBudgeted();
    this.totalMonthlyBudgeted = this.categoryService.getTotalBudgetedForMonth();
    let posNegTotals =  this.categoryService.getPostiveAndNegativeRolloverTotals(this.categories);
    this.positiveRollover = posNegTotals[0];
    this.negativeRollover = posNegTotals[1];
    this.spentInMonth = this.expenseService.getSpentInMonth(this.selectedDate);
    this.earnedInMonth = this.expenseService.getEarnedInMonth(this.selectedDate);
  }
}

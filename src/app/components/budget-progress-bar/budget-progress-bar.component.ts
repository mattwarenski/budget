import { Category } from '../../model/category';
import { Input, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-budget-progress-bar',
  templateUrl: './budget-progress-bar.component.html',
  styles: [`a {
    color : black 
  }`]
})
export class BudgetProgressBarComponent implements OnInit {

  @Input() category: Category;
  @Input() selectedDate: string;
  totalSpent: number;
  percentage: number;
  dateString: string;
  totalAmount: number;

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.totalAmount = this.category.isRollover ? this.categoryService.getRolloverTotal(this.category) : this.category.budgetAmount;
    this.totalSpent = -this.categoryService.getTotal(this.category, new Date(this.selectedDate))
    this.percentage = Math.round((this.totalSpent / this.totalAmount) * 100);
    this.dateString = this.selectedDate.toString();
  }


  getStyleClass() {
    if(this.percentage < 100){
      return "progress-bar-success";
    } else if ( this.percentage === 100){
      return "progress-bar-warning";
    } else{
      return "progress-bar-danger";
    }
  }

  getRoundedPercentage( ){
    let percent = this.percentage;
    if(percent > 100){
      return "100%";
    }
    return percent + "%";
  }

}

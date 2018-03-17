import { Category } from '../../model/category';
import { Input, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import * as moment from 'moment';

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
  total: number;
  percentage: number;
  dateString: string;
  amountLeft: number;
  denominator: number;

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.total = -this.categoryService.getTotal(this.category, new Date(this.selectedDate))
    if(this.category.isRollover){
      this.denominator = this.categoryService.getRolloverTotal(this.category,new Date(this.selectedDate));
    }else{
      this.denominator = this.category.budgetAmount;
    }

    //If you have no money and haven't spent it you've used it all 
    if(this.denominator === 0 && this.total === 0){
      this.percentage = 100; 
    }
    //If you have no money and have spent any you've over spent
    else if((this.denominator ===0 && this.total > 0) || this.denominator < 0){
      this.percentage = 101; 
    } else{
      this.percentage = Math.round((this.total / this.denominator) * 100);
    }
    this.dateString = this.selectedDate.toString();
    this.amountLeft = this.denominator - this.total;
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

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
  total: number;
  percentage: number;
  dateString: string;
  rollOverAmount: number;

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.total = -this.categoryService.getTotal(this.category, new Date(this.selectedDate))
    this.percentage = Math.round((this.total / this.category.budgetAmount) * 100);
    this.dateString = this.selectedDate.toString();
    if(this.category.isRollover){
      this.rollOverAmount = this.categoryService.getRolloverTotal(this.category); 
    }
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

  getLabelStyleClass(){
    if(this.rollOverAmount > 0){
      return "label-success" 
    }
    else if(this.rollOverAmount < 0){
      return "label-danger" 
    }
    return "label-warning" 
  }

  getRoundedPercentage( ){
    let percent = this.percentage;
    if(percent > 100){
      return "100%";
    }
    return percent + "%";
  }

}

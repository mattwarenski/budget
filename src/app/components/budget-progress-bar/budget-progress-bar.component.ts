import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-budget-progress-bar',
  templateUrl: './budget-progress-bar.component.html',
  styleUrls: ['./budget-progress-bar.component.css']
})
export class BudgetProgressBarComponent implements OnInit {

  @Input() total: number;
  @Input() amount: number;
  @Input() title: string;
  @Input() categoryId: number;
  @Input() month: string;
  @Input() isOneTime: boolean;
  @Input() isRollover: boolean;
  percentage: number;

  constructor() { }

  ngOnInit() {
    this.percentage = Math.round((this.amount / this.total) * 100);
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

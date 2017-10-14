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
  percentage: number;

  constructor() { }

  ngOnInit() {
    this.percentage = Math.round((this.amount / this.total) * 100);
  }

}

import { Output, Input, EventEmitter, Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent implements OnInit {
  months: any[];
  @Output() onSelect = new EventEmitter();
  @Input() selectedDate: Date;

  selectedVal: string;

  constructor() { }

  ngOnInit() {
    if(!this.selectedDate){
      this.selectedDate = moment(new Date()).startOf('month').toDate();
    }
    else{
      this.selectedDate = moment(this.selectedDate).startOf('month').toDate(); 
    }

    this.months = [];

    let date = moment(new Date()).add(1, 'months').startOf('month').toDate();
    this.months.push({
      label : `${moment.months(date.getMonth())} ${date.getFullYear()}`,
      value : date.toString()  
    });

    for(var i = 0; i < 12; i++){
      let date = moment(new Date()).subtract(i, 'months').startOf('month').toDate();
      this.months.push({
        label : `${moment.months(date.getMonth())} ${date.getFullYear()}`,
        value : date.toString()  
      });
    }

    this.selectedVal = this.selectedDate.toString();
  }

  onChange(){
    this.onSelect.emit(new Date(this.selectedVal)); 
  }

}

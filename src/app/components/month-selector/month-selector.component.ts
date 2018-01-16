import { Output, Input, EventEmitter, Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent implements OnInit {
  months: any[];
  selectedVal: string;
  private __selectedDate: Date;

  @Output() onSelect = new EventEmitter();
  @Input() set selectedDate(date: Date){
    this.__selectedDate = moment(date).startOf('month').toDate(); 
    this.selectedVal = this.__selectedDate.toString();
  }

  get selectedDate(){
    return this.__selectedDate; 
  }


  constructor() { }

  ngOnInit() {
    if(!this.__selectedDate){
      this.__selectedDate = moment(new Date()).startOf('month').toDate();
    }
    else{
      this.__selectedDate = moment(this.__selectedDate).startOf('month').toDate(); 
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

    this.selectedVal = this.__selectedDate.toString();
  }

  onChange(){
    this.onSelect.emit(new Date(this.selectedVal)); 
  }

}

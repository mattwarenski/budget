import * as moment from 'moment';

export enum Term{
  Monthly, 
  OneTime
}


export const TermDropdownLabels = [
  {label : "One Time", value : Term.OneTime},
  {label : "Monthly", value : Term.Monthly}
]

export class TermUtils { 

  static getMonthStart(date: Date){
   return moment(date).startOf('month').toDate()
  }

  static getMonthEnd(date: Date){
   return moment(date).endOf('month').toDate()
  }
  
  static getTermStartDate(term: Term, termDelta = 0): Date{
      if(term == Term.Monthly){
        return moment().startOf('month').add(termDelta, 'months').toDate();
      }
  }

  static getTermEndDate(term: Term, termDelta = 0): Date{
    if(term == Term.Monthly){
      return moment().endOf('month').add(termDelta, 'months').toDate();
    }
  }
}

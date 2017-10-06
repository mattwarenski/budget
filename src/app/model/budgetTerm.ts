import * as moment from 'moment';

export enum Term{
  Monthly, 
  Yearly,
  Quarterly,
  PayPeriod,
  OneTime
}


export const TermDropdownLabels = [
  {label : "One Time", value : Term.OneTime},
  {label : "Monthly", value : Term.Monthly},
  {label : "Yearly", value : Term.Yearly},
  {label : "Quarterly", value : Term.Quarterly},
  {label : "Pay Period", value : Term.PayPeriod}
]

export class TermUtils { 
  
  static getTermStartDate(term: Term): Date{
    if(term == Term.Monthly){
      return moment().startOf('month').toDate();
    }
    else if(term == Term.Yearly){
      return moment().startOf('year').toDate();
    }
    else if(term == Term.Quarterly){
      return moment().startOf('quarter').toDate();
    }
  }

  static getTermEndDate(term: Term): Date{
    if(term == Term.Monthly){
      return moment().endOf('month').toDate();
    }
    else if(term == Term.Yearly){
      return moment().endOf('year').toDate();
    }
    else if(term == Term.Quarterly){
      return moment().endOf('quarter').toDate();
    }
  }
}

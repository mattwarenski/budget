
import { Expense } from './app/model/expense';

export class Util{ 

  static sumExpenses(expenses: Expense[]){
    return  expenses.reduce((total: number, current: Expense)=> total + (+current.amount), 0)
  }
}

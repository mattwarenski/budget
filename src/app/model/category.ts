import { Column, DataType, Constraint } from "sqlite-base/decorators";
import { RowEntity } from "sqlite-base/RowEntity";
import { Term } from './budgetTerm';

export class Category extends RowEntity{
  constructor(){
    super("Category") 
  }

  @Column(DataType.INTEGER, Constraint.PRIMARY_KEY)
  id: number;

  @Column(DataType.VARCHAR, Constraint.NOT_NULL)
  name: string;

  @Column(DataType.INTEGER)
  parentId: number;

  @Column(DataType.DECIMAL ,Constraint.NOT_NULL)
  budgetAmount: number; 

  @Column(DataType.DECIMAL)
  total: number; 

  @Column(DataType.VARCHAR)
  term: Term;

  @Column(DataType.DATE)
  rollOverStartDate: Date;

  @Column(DataType.BOOLEAN)
  isRollover: boolean;

  @Column(DataType.DECIMAL)
  rolloverStartAmount: number;
}

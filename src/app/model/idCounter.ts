
import { Column, DataType, Constraint } from "sqlite-base/decorators";
import { RowEntity } from "sqlite-base/RowEntity";
import { Term } from './budgetTerm';

export class IdCounter extends RowEntity{
  constructor(){
    super("IdCounter") 
  }

  @Column(DataType.INTEGER, Constraint.PRIMARY_KEY)
  id: number;

  @Column(DataType.INTEGER)
  nextSplitId: number;

}

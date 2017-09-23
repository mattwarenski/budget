import { Column, DataType, Constraint } from "../sql/decorators";
import { RowEntity } from "../sql/RowEntity";

export class Category extends RowEntity{
  constructor(){
    super("Category") 
  }

  @Column(DataType.INTEGER, Constraint.PRIMARY_KEY)
  id: number;

  @Column(DataType.VARCHAR, Constraint.NOT_NULL)
  name: string;

  @Column(DataType.INTEGER)
  parentId: string;

  @Column(DataType.DECIMAL ,Constraint.NOT_NULL)
  budgetAmount: number; 

  //TODO Implement durations
}

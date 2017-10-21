import { Column, DataType, Constraint } from "../sql/decorators";
import { RowEntity } from "../sql/RowEntity";

export class Account extends RowEntity{
  constructor(){
    super("Account") 
  }

  @Column(DataType.INTEGER, Constraint.PRIMARY_KEY)
  id: number;

  @Column(DataType.VARCHAR, Constraint.NOT_NULL)
  name: string;

  @Column(DataType.VARCHAR)
  bank: string;

  @Column(DataType.DECIMAL ,Constraint.NOT_NULL)
  balance: number; 
}

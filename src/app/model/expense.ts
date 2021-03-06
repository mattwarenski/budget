import { Column, DataType, Constraint } from "sqlite-base/decorators";
import { RowEntity } from "sqlite-base/RowEntity";

export class Expense extends RowEntity{
  constructor(){
    super("Expense")
  }

  @Column(DataType.INTEGER, Constraint.PRIMARY_KEY)
  id: number;

  @Column(DataType.DATE)
  date: Date;

  @Column(DataType.VARCHAR, Constraint.NOT_NULL)
  name: string;

  @Column(DataType.VARCHAR)
  description: string;

  @Column(DataType.DECIMAL ,Constraint.NOT_NULL)
  amount: number;

  @Column(DataType.INT)
  categoryId: number;
e
  @Column(DataType.INT, Constraint.NOT_NULL)
  accountId: number;

  @Column(DataType.INT)
  splitId: number;

  sortKey: string;
}

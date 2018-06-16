import { RowEntity } from "sqlite-base/RowEntity";
import { Column, DataType, Constraint } from "sqlite-base/decorators";

export class Settings extends RowEntity {
  constructor(){
    super("Settings");
  }

  @Column(DataType.INTEGER, Constraint.PRIMARY_KEY)
  id: number;

  @Column(DataType.VARCHAR)
  storageProvider: string;
}

import { Injectable } from '@angular/core';
import { IdCounter } from '../model/idCounter';
import { AbstractTableService } from './abstractTable.service';
import { SqlService } from './sql.service';
import { Router } from '@angular/router';

@Injectable()
export class IdCounterService extends AbstractTableService<IdCounter> {
  currentIds: IdCounter;

  constructor(private __sqlService: SqlService, private router: Router) {
    super(IdCounter, __sqlService, router);
    let res = this.getAll(new IdCounter()); 
    if(!res.length){
      this.currentIds = new IdCounter(); 
      //start high to allow for data cleanup if needed
      this.currentIds.nextSplitId = 200;
    }
    else{
      this.currentIds = res[0]; 
    }
  }

  /**
   * Auto increments the next change id and returns it. 
   */
  getNextSplitId(): number{
    let id = this.currentIds.nextSplitId + 1; 
    this.currentIds.nextSplitId = id;
    this.upsertRow(this.currentIds);
    return id;
  }
}

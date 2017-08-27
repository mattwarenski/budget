import { Component } from '@angular/core';
import { SqlService } from "./services/sql.service";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { Expense } from "./model/expense";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    this.sqlService.openDB('/home/mathew/TEST_DB.sqlite', '/home/mathew/dev/scrooge/src/assets/sql/schema.sql'); 
  }

  title = 'app';
  
  constructor(private sqlService: SqlService){ }
}

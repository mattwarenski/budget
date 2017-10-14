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
  showCategories: boolean;
  showAccounts: boolean;
  showStats: boolean;

  ngOnInit(): void {
    this.showAccounts = true;
    this.showCategories = true;
    this.showStats = true;
  }
  
  constructor(private sqlService: SqlService){ }
}

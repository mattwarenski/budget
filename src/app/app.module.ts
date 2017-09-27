import { ExpenseService } from "./services/expense.service";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SqlService } from "./services/sql.service";
import { CategoryService } from "./services/category.service";
import { ExpenseViewerComponent } from './components/expense-viewer/expense-viewer.component';
import {CalendarModule,DropdownModule,  DataTableModule,SharedModule} from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { CategoryViewerComponent } from './components/category-viewer/category-viewer.component';
import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { AccountService } from "./services/account.service";
import { LayoutService } from "./services/layout.service";

@NgModule({
  declarations: [
    AppComponent,
    ExpenseViewerComponent,
    CategoryViewerComponent,
    AccountSelectorComponent
  ],
  imports: [
    BrowserModule, 
    DataTableModule, 
    SharedModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [SqlService, CategoryService, ExpenseService, AccountService, LayoutService],
  bootstrap: [AppComponent]
})
export class AppModule { }

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

@NgModule({
  declarations: [
    AppComponent,
    ExpenseViewerComponent,
    CategoryViewerComponent
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
  providers: [SqlService, CategoryService, ExpenseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

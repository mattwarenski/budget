import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SqlService } from "./services/sql.service";
import { ExpenseViewerComponent } from './components/expense-viewer/expense-viewer.component';
import {CalendarModule, DataTableModule,SharedModule} from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    ExpenseViewerComponent
  ],
  imports: [
    BrowserModule, 
    DataTableModule, 
    SharedModule,
    CalendarModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [SqlService],
  bootstrap: [AppComponent]
})
export class AppModule { }

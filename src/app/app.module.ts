import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SqlService } from "./services/sql.service";
import { ExpenseViewerComponent } from './components/expense-viewer/expense-viewer.component';
import {DataTableModule,SharedModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseViewerComponent
  ],
  imports: [
    BrowserModule, 
    DataTableModule, 
    SharedModule
  ],
  providers: [SqlService],
  bootstrap: [AppComponent]
})
export class AppModule { }

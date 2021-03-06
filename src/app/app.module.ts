import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SqlService } from "./services/sql.service";
import { CategoryService } from "./services/category.service";
import { ExpenseViewerComponent } from './components/expense-viewer/expense-viewer.component';
import {CalendarModule, DropdownModule, DataTableModule, ProgressBarModule, SharedModule} from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { CategoryViewerComponent } from './components/category-viewer/category-viewer.component';
import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { AccountService } from "./services/account.service";
import { LayoutService } from "./services/layout.service";
import { BudgetPercentageViewerComponent } from './components/budget-percentage-viewer/budget-percentage-viewer.component';
import { BudgetProgressBarComponent } from './components/budget-progress-bar/budget-progress-bar.component';
import { SafeCurrencyPipe } from './pipes/safe-currency.pipe';
import { MonthSelectorComponent } from './components/month-selector/month-selector.component';
import { AppRoutingModule } from './app-routing.module';
import { ExpenseService } from './services/expense.service';
import { IdCounterService } from './services/id-counter.service';
import { AccordionModule } from 'primeng/components/accordion/accordion';
import { SettingsViewComponent } from './components/settings-view/settings-view.component';
import {SettingsService} from './services/settings.service';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseViewerComponent,
    CategoryViewerComponent,
    AccountSelectorComponent,
    BudgetPercentageViewerComponent,
    BudgetProgressBarComponent,
    SafeCurrencyPipe,
    MonthSelectorComponent,
    SettingsViewComponent,
  ],
  imports: [
    BrowserModule,
    DataTableModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule,
    ProgressBarModule,
    AppRoutingModule,
    AccordionModule,
  ],
  providers: [
    SqlService,
    CategoryService,
    AccountService,
    LayoutService,
    ExpenseService,
    IdCounterService,
    SettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

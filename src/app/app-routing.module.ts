import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { ExpenseViewerComponent } from './components/expense-viewer/expense-viewer.component';
import { CategoryViewerComponent } from './components/category-viewer/category-viewer.component';
import { BudgetPercentageViewerComponent } from './components/budget-percentage-viewer/budget-percentage-viewer.component';

const appRoutes: Routes = [
  {path: "accounts", component: AccountSelectorComponent},
  {path: "expenses", component: ExpenseViewerComponent},
  {path: "categories", component: CategoryViewerComponent},
  {path: "progress", component: BudgetPercentageViewerComponent},
  { path: "**", component: AccountSelectorComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports : [
    RouterModule
  ]
})
export class AppRoutingModule { }

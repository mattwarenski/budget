import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-budget-percentage-viewer',
  templateUrl: './budget-percentage-viewer.component.html',
  styleUrls: ['./budget-percentage-viewer.component.css']
})
export class BudgetPercentageViewerComponent implements OnInit {

  categorySubscription: Subscription;
  categoryMetadata: any[];

  constructor(
    private categoryService: CategoryService 
  ) { }

  ngOnInit() {
    this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[])=>{
      Promise.all(categories.map( category => this.categoryService.getTotal(category, 0)))
        .then( totals =>{
          this.categoryMetadata = totals.map( (total, index) => {
            return { 'title' : categories[index].name, 'total' : categories[index].budgetAmount, 'amount' :  -total };
          });
          console.log("cat map", this.categoryMetadata);
        });
    });
  }

}

import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-viewer',
  templateUrl: './category-viewer.component.html',
  styleUrls: ['./category-viewer.component.css']
})
export class CategoryViewerComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }
  categories: Category[];
  categoryList: any[];
  selectedCategory: Category;

  ngOnInit() {
    this.categoryService.getAll().subscribe((categories: Category[])=>{
        this.categories = categories;
        this.categoryList = CategoryService.mapCategoriesForSelect(categories); 
        if(!this.selectedCategory && this.categories.length){
          this.selectedCategory = this.categories[0]; 
        }
     });
  }

  updateCategory(){
    this.categoryService.upsertRow(this.selectedCategory);
  }

  addCategory(){
    let category = new Category();
    category.name = "new category";
    category.budgetAmount = 0;
    this.selectedCategory = category; 
    this.categoryService.upsertRow(category);
  }

  removeCategory(){
    if(!this.selectedCategory){
      console.warn("Can't delete. No selected category") 
      return;
    }
    let index = this.categories.findIndex( c => c.id === this.selectedCategory.id);
    this.categoryService.deleteRow(this.selectedCategory); 
    if(!this.categories.length){
      this.selectedCategory = null; 
    }
    else{
      this.selectedCategory = index-1 < 0 ? this.categories[0] : this.categories[index - 1];
    }
  }

  onCategorySelect(event){
    this.selectedCategory = this.categories.find( c => c.id === event.value);
  }
}

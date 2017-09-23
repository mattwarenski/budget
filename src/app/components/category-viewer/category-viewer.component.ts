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
    this.categoryService.getCategories().subscribe( (categories: Category[])=>{
        this.categories = categories;
        this.categoryList = CategoryService.mapCategoriesForSelect(categories); 
        if(this.categories.length){
          this.selectedCategory = this.categories[0]; 
        }
     });
  }

  updateCategory(){
    this.categoryService.upsertCategory(this.selectedCategory);
  }

  removeCategory(){
    this.categoryService.deleteCategory(this.selectedCategory); 
  }

  onCategorySelect(event){
    console.log("event", event.value); 
    this.selectedCategory = this.categories.find( c => c.id === event.value);
    console.log("selectedCategory", this.selectedCategory);
  }

}

import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-category-viewer',
  templateUrl: './category-viewer.component.html',
  styleUrls: ['./category-viewer.component.css']
})
export class CategoryViewerComponent implements OnInit, OnDestroy{

  constructor(private categoryService: CategoryService) { }
  categories: any[];
  parentCategories: any[];
  categoryList: any[];
  selectedCategory: Category;
  categorySubscription: Subscription;

  ngOnInit() {
    this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[])=>{
      this.categories = categories;
      this.categoryList = CategoryService.mapCategoriesForSelect(categories);
      if(this.categories.length){
        if(!this.selectedCategory){
          this.selectedCategory = this.categories[0]; 
        }
        this.parentCategories = this.getParentCategories();
      }
      else{
        this.selectedCategory = null;
        this.parentCategories = null;
      }
    });
  }

  ngOnDestroy(){
    this.categorySubscription.unsubscribe();
  }

  getParentCategories(): any[]{
    let parentCategories =  this.categories.filter(
      (category: Category)=>!category.parentId && category.id !== this.selectedCategory.id);
    let mappedCategories = CategoryService.mapCategoriesForSelect(parentCategories);
    return [{label : "None", value : 0}].concat(mappedCategories);
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
      this.selectedCategory = index - 1 < 0 ? this.categories[0] : this.categories[index - 1];
    }
  }

  isParentCategory(){
    return this.categories.some((category: Category) => this.selectedCategory.id === category.parentId); 
  }

  onCategorySelect(event){
    this.selectedCategory = this.categories.find( c => c.id === event.value);
  }
}

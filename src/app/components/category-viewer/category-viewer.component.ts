import { Category } from "../../model/category";
import { CategoryService } from "../../services/category.service";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { TermDropdownLabels } from '../../model/budgetTerm';
import { Observable } from 'rxjs';
import * as moment from 'moment';

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
  terms = TermDropdownLabels;
  selectedCategory: Category;
  categorySubscription: Subscription;
  currentCategoryTotal: Observable<number>;
  editingNew: boolean;
  moment = moment;

  ngOnInit() {
    this.categorySubscription = this.categoryService.getAll().subscribe((categories: Category[])=>{
      this.categories = categories;
      this.categoryList = this.categoryService.arrangeCategories();
      if(this.categories.length){
        if(!this.selectedCategory){
          this.selectedCategory = this.categories[0]; 
          this.updateCategoryTotal();
        }
        else{
          this.selectedCategory = this.categories.find( c => c.name === this.selectedCategory.name); 
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
    let mappedCategories = this.categoryService.arrangeCategories();
    return [{label : "None", value : 0}].concat(mappedCategories);
  }

  onIsRolloverChange(){
    if(!this.selectedCategory.rollOverStartDate || isNaN(this.selectedCategory.rollOverStartDate.getDate())){
      this.selectedCategory.rollOverStartDate = new Date();
    }
    this.updateCategory();
  }

  updateCategory(){
    if(this.categoryValid()){
      this.categoryService.upsertRow(this.selectedCategory);
      this.editingNew = false;
    }
    else{
      console.error("can't update category");  
    }
  }

  selectedCategoryHasRolloverDate(){
    return this.selectedCategory.isRollover && moment(this.selectedCategory.rollOverStartDate).isValid();
  }


  private categoryValid(){
    return this.selectedCategory.name !== null
      && !(this.editingNew && this.categories.some( c => this.selectedCategory.name === c.name));
  }

  addCategory(){
    let category = new Category();
    category.budgetAmount = 0;
    this.selectedCategory = category; 
    this.editingNew = true;
  }

  removeCategory(){
    //TODO: If the category it doesn't have an id
    if(!this.selectedCategory){
      return;
    }
    this.categoryService.deleteRow(this.selectedCategory); 
    if(!this.categories.length){
      this.selectedCategory = null; 
    }
    else{
      let index = this.categories.findIndex( c => c.id === this.selectedCategory.id);
      this.selectedCategory = index - 1 < 0 ? this.categories[0] : this.categories[index - 1];
    }
  }

  isParentCategory(){
    return this.categories.some((category: Category) => this.selectedCategory.id === category.parentId); 
  }

  onCategorySelect(event){
    this.selectedCategory = this.categories.find( c => c.id === event.value);
    this.updateCategoryTotal();
  }

  private updateCategoryTotal(){
    this.currentCategoryTotal = Observable.fromPromise(this.categoryService.getTotal(this.selectedCategory,0));
  }

}

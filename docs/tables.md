#Tables

##Expense
  * id - unique not null
  * date - not null
  * amount - not null
  * category id - optional
  * split id - optional - id of parent transaction that this one was split from 
  * account id - not null

## Account
  * id - unique, not null
  * name - not null - the account name
  * bank - not null 
  * ballance - not null 

## Categories
  * id - unique, not null
  * name - not null 
  * parent id - optional - make this category a subcategory of parent
  * amount - optional - make this category a budget
  * duration - optional - the duration of the budget
  * duration unit - optional - days | months | years

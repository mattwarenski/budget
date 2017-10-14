import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetProgressBarComponent } from './budget-progress-bar.component';

describe('BudgetProgressBarComponent', () => {
  let component: BudgetProgressBarComponent;
  let fixture: ComponentFixture<BudgetProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPercentageViewerComponent } from './budget-percentage-viewer.component';

describe('BudgetPercentageViewerComponent', () => {
  let component: BudgetPercentageViewerComponent;
  let fixture: ComponentFixture<BudgetPercentageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetPercentageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPercentageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

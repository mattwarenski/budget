import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseViewerComponent } from './expense-viewer.component';

describe('ExpenseViewerComponent', () => {
  let component: ExpenseViewerComponent;
  let fixture: ComponentFixture<ExpenseViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearComparisonReportComponent } from './year-comparison-report.component';

describe('YearComparisonReportComponent', () => {
  let component: YearComparisonReportComponent;
  let fixture: ComponentFixture<YearComparisonReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearComparisonReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearComparisonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

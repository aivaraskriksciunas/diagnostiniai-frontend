import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolYearsListComponent } from './school-years-list.component';

describe('SchoolYearsListComponent', () => {
  let component: SchoolYearsListComponent;
  let fixture: ComponentFixture<SchoolYearsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolYearsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolYearsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

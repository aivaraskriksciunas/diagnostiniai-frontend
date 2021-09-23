import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ReportingComponent } from './reporting.component';
import { StudentReportComponent } from './student-report/student-report.component';
import { FormsModule } from '@angular/forms';
import { StudentGroupReportComponent } from './student-group-report/student-group-report.component';
import { YearComparisonReportComponent } from './year-comparison-report/year-comparison-report.component';
import { LevelReportComponent } from './level-report/level-report.component';
const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
  },
  {
    path: 'student',
    component: StudentReportComponent
  },
  {
    path: 'class',
    component: StudentGroupReportComponent
  },
  {
    path: 'yearly',
    component: YearComparisonReportComponent,
  },
  {
    path: 'levels',
    component: LevelReportComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    SharedModule,
    FormsModule,
  ],
  declarations: [
    ReportingComponent,
    StudentReportComponent,
    StudentGroupReportComponent,
    YearComparisonReportComponent,
    LevelReportComponent
  ],
})
export class ReportingModule { }

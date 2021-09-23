import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SchoolYearsListComponent } from './school-years-list/school-years-list.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolYearsListComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild( routes ),
    CommonModule,
    FormsModule
  ],
  declarations: [
    SchoolYearsListComponent
  ],
  providers: [
  ]
})
export class SchoolYearsModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { ViewExamComponent } from './view-exam/view-exam.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { ExamListComponent } from './exam-list/exam-list.component';

const routes : Routes = [
  { 
    path: 'add',
    component: EditExamComponent
  },
  {
    path: 'edit/:id',
    component: EditExamComponent
  },
  {
    path: 'view/:id',
    component: ViewExamComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    ReactiveFormsModule,

    SharedModule
  ],
  declarations: [
    EditExamComponent,
    ViewExamComponent,
    ExamListComponent
  ]
})
export class ExamsModule { }

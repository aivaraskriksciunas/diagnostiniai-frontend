import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddExamComponent } from './add-exam/add-exam.component';

const routes : Routes = [
  { 
    path: '',
    component: ListComponent
  },
  {
    path: 'add',
    component: AddExamComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    SharedModule,
    FormsModule,

    ReactiveFormsModule
  ],
  declarations: [
    ListComponent,
    AddExamComponent
  ]
})
export class AdminExamsModule { }

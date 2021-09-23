import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewSubjectComponent } from './view-subject/view-subject.component';
import { EditSubjectComponent } from './edit-subject/edit-subject.component';

const routes: Routes = [
  {
    path: 'add',
    component: EditSubjectComponent
  },
  {
    path: 'view/:id',
    component: ViewSubjectComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    EditSubjectComponent,
    ViewSubjectComponent
  ],
  providers: [
  ]
})
export class SubjectsModule { }

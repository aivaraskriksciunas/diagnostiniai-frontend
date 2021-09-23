import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewGroupComponent } from './view-group/view-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { SharedModule } from 'src/app/shared.module';
import { AddStudentComponent } from './add-student/add-student.component';

const routes: Routes = [
  {
    path: 'add',
    component: EditGroupComponent
  },
  {
    path: 'view/:id',
    component: ViewGroupComponent
  },
  {
    path: 'students/:group_id',
    component: AddStudentComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    FormsModule,
    ReactiveFormsModule,

    SharedModule
  ],
  declarations: [
    EditGroupComponent,
    ViewGroupComponent,
    AddStudentComponent
  ],
  providers: [
  ]
})
export class GroupsModule { }

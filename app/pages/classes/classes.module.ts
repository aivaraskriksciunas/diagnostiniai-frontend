import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassesService } from '../../shared/services/classes.service';
import { EditClassComponent } from './edit-class/edit-class.component';
import { ViewClassComponent } from './view-class/view-class.component';
import { SharedModule } from 'src/app/shared.module';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { AddStudentComponent } from './view-class/add-student/add-student.component';
import { UploadStudentsComponent } from './upload-students/upload-students.component';
import { DocumentsService } from '../../shared/services/documents.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EditClassComponent
  },
  {
    path: 'add',
    component: EditClassComponent
  },
  {
    path: 'upload',
    component: UploadStudentsComponent,
  },
  {
    path: 'student/:id',
    component: EditStudentComponent
  },
  {
    path: ':id',
    component: ViewClassComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forChild( routes ),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule
  ],
  declarations: [
    EditClassComponent,
    ViewClassComponent,
    EditStudentComponent, 
    AddStudentComponent, 
    UploadStudentsComponent,
  ],
  providers: [
    ClassesService,
    DocumentsService
  ],
})
export class ClassesModule { }
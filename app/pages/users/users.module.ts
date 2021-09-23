import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list/list-users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';

const routes: Routes = [
  {
    path: '',
    component: ListUsersComponent
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
    ListUsersComponent,
    UserEditComponent
  ],
})
export class UsersModule { }

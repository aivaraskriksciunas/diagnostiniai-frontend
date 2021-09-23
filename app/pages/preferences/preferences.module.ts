import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PreferencesComponent,
  },
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
    PreferencesComponent
  ]
})
export class PreferencesModule { }

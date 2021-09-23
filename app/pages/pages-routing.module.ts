import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { IsAuthenticatedGuard } from '../shared/guards/is-authenticated.guard';
import { IsAdminGuard } from '../shared/guards/is-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [ IsAuthenticatedGuard ],
    children: [
      {
        path: '',
        loadChildren: './reporting/reporting.module#ReportingModule',
        pathMatch: 'full'
      },
      {
        path: 'users',
        canActivate: [ IsAdminGuard ],
        loadChildren: './users/users.module#UsersModule'
      },
      {
        path: 'years',
        loadChildren: './school-years/school-years.module#SchoolYearsModule'
      },
      {
        path: 'subject',
        loadChildren: './subjects/subjects.module#SubjectsModule'
      },
      {
        path: 'class',
        loadChildren: './classes/classes.module#ClassesModule'
      },
      {
        path: 'group',
        loadChildren: './groups/groups.module#GroupsModule'
      },
      {
        path: 'exam',
        loadChildren: './exams/exams.module#ExamsModule'
      },
      {
        path: 'admin-exam',
        canActivate: [ IsAdminGuard ],
        loadChildren: './admin-exams/admin-exams.module#AdminExamsModule'
      },
      {
        path: 'reporting',
        loadChildren: './reporting/reporting.module#ReportingModule'
      },
      {
        path: 'preferences',
        canActivate: [ IsAdminGuard ],
        loadChildren: './preferences/preferences.module#PreferencesModule'
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }

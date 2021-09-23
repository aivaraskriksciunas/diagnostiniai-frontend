import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ToastNotificationsComponent } from './shared/components/toast-notifications/toast-notifications.component';
import { ToastNotificationService } from './shared/services/toast-notification.service';
import { LeftMenuComponent } from './shared/components/left-menu/left-menu.component';
import { SubjectsState } from '../shared/states/subjects.state';
import { TrimesterState } from '../shared/states/trimesters.state';
import { ExpandItemComponent } from './shared/components/left-menu/expand-item/expand-item.component';
import { ClassesState } from '../shared/states/classes.state';
import { StateService } from '../shared/services/state.service';
import { CurrentTrimesterState } from '../shared/states/current-trimester.state';
import { SharedModule } from '../shared.module';
import { UsersService } from '../shared/services/users.service';
import { PreferencesState } from '../shared/states/preferences.state';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
  ],
  declarations: [
    PagesComponent,
    ToastNotificationsComponent,
    LeftMenuComponent,
    ExpandItemComponent,
  ],
  providers: [
    ToastNotificationService,

    SubjectsState,
    TrimesterState,
    CurrentTrimesterState,
    ClassesState,
    StateService,
    UsersService,
    PreferencesState,
  ]
})
export class PagesModule { }

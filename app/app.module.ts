import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './shared/services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorProviders } from './shared/interceptors/interceptors-provider';
import { TrimesterService } from './shared/services/trimester.service';
import { SubjectsService } from './shared/services/subjects.service';
import { GroupsService } from './shared/services/groups.service';
import { StudentsService } from './shared/services/students.service';
import { ExamsService } from './shared/services/exams.service';
import { PreferencesService } from './shared/services/preferences.service';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    AuthenticationService,
    TrimesterService,
    SubjectsService,
    GroupsService,
    StudentsService,
    ExamsService,
    PreferencesService,
    
    InterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { TrimesterService } from 'src/app/shared/services/trimester.service';
import { ClassesService } from './classes.service';
import { SubjectsService } from './subjects.service';
import { TrimesterState } from 'src/app/shared/states/trimesters.state';
import { SubjectsState } from '../states/subjects.state';
import { ClassesState } from '../states/classes.state';
import { ToastNotificationService } from '../../pages/shared/services/toast-notification.service';
import { CurrentTrimesterState } from '../states/current-trimester.state';
import { PreferencesState } from '../states/preferences.state';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private trimesterService : TrimesterService,
    private classesService : ClassesService,
    private subjectsService : SubjectsService,

    private trimesterState : TrimesterState,
    private subjectState : SubjectsState,
    private classesState : ClassesState,
    private currentTrimesterState: CurrentTrimesterState,

    private preferencesState : PreferencesState,
    private preferencesService : PreferencesService,

    private toastService : ToastNotificationService
  ) { 
  }

  public initStates() {
    
    // Subscribe to changes to selected state 
    this.currentTrimesterState.getState().subscribe(
      res => {
        if ( !res.isSelected ) return;
        
        this.classesService.getClassesList( {
          year_id: res.year.id
        } ).subscribe(
          classes => this.classesState.setState( classes )
        )
      }
    )
    
    // Get a list of all trimesters
    this.trimesterService.getTrimesters().subscribe(
      res => this.trimesterState.setSchoolYears( res ),
      _ => this.toastService.pushErrorNotification( "Klaida!", "Nepavyko gauti pusmečių sąrašo iš serverio", 8000 )
    )

    // Get a list of all subjects
    this.subjectsService.getSubjectList().subscribe(
      res => this.subjectState.setState( res ),
      _ => this.toastService.pushErrorNotification( "Klaida!", "Nepavyko gauti dalykų sąrašo iš serverio", 8000 )
    )

    this.preferencesService.listPreferences().subscribe(
      res => this.preferencesState.setState( res ),
      _ => this.toastService.pushErrorNotification( "Klaida!", "Nepavyko gauti nustatymų iš serverio. Kai kurios funkcijos gali neveikti", 8000 )
    )
  }


}

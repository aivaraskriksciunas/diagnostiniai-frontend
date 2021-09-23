import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from '../../../shared/services/groups.service';
import { ToastNotificationService } from 'src/app/pages/shared/services/toast-notification.service';
import { UsersService } from '../../../shared/services/users.service';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { ExamsService } from 'src/app/shared/services/exams.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { SelectItem } from '../../shared/components/multiple-select/multiple-select.component';
import { SubjectsService } from 'src/app/shared/services/subjects.service';
import { map } from 'rxjs/operators';

interface IGroupListItem {
  id: number,
  name: string,
  head_teacher: string,
  subject: string
}

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss', '../../shared/styles/pages.styles.scss']
})
export class AddExamComponent implements OnInit {

  public isLoading : boolean = true;

  public form : FormGroup;

  public availableGroups : SelectItem[] = []
  public selectedGroups : number[] = []

  // Creating exams
  public isSavingExams : boolean = false;
  public examsSaved : number = 0;

  constructor(
    private formBuilder : FormBuilder,
    private groupService : GroupsService,
    private subjectService : SubjectsService,
    private toastService : ToastNotificationService,
    private trimesterState: CurrentTrimesterState,
    private examService : ExamsService,
    private authService : AuthenticationService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [ '', [ Validators.required ] ],
      max_score: [ '', [ Validators.required ] ],
      min_score: [ 0, [ Validators.required ] ],
      taken_at: [ '', [ Validators.required ] ],
      is_diagnostinis: [ true ],
    })

    this.subjectService.getSubjectList().subscribe(
      list => this.availableGroups = list.map(
        ( sub ) : SelectItem => ({
          text: sub.name,
          value: sub.id,
          asyncChildrenLoader: ( val ) => this.groupService.listGroups(
            { subject: val, trimester_id: this.trimesterState.getCurrentState().trimester.id }
          ).pipe(
            map(
              ( groupList ) : SelectItem[] => groupList.map(
                group => ({
                  text: group.name,
                  value: group.id,
                })
              )
            )
          ) 
        })
      )
    )
  }

  public groupsSelected( groups ) {
    this.selectedGroups = groups;
  }

  public createTests() {
    this.form.markAllAsTouched();
    if ( this.form.invalid || this.selectedGroups.length == 0 ) {
      this.toastService.pushErrorNotification( "Nepilnai užpildyti duomenys", "Prašome pilnai užpildyti duomenis apie testą", 10000 );
      return;
    }
    this.examsSaved = 0;
    this.isSavingExams = true;
    this.createTest();
  }

  private createTest() {
    let authenticatedUser = this.authService.authenticatedUser.id;
    this.examService.createExam({
      name: this.form.get( 'name' ).value,
      min_score: this.form.get( 'min_score' ).value,
      max_score: this.form.get( 'max_score' ).value,
      taken_at: this.form.get( 'taken_at' ).value == '' ? null : this.form.get( 'taken_at' ).value,
      group: this.selectedGroups[this.examsSaved],
      owner: authenticatedUser,
      is_diagnostinis: this.form.get( 'is_diagnostinis' ).value
    }).subscribe(
      () => { 
        this.examsSaved++
        if ( this.examsSaved >= this.selectedGroups.length ) {
          this.isSavingExams = false;
          this.toastService.pushSuccessNotification( "", "Atsiskaitomieji darbai sukurti", 5000 )
          return;
        }

        // Call this function again
        setTimeout( () => { this.createTest() }, 1 );
      },
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko išsaugoti atsiskaitomojo darbo. Bandykite iš naujo", 10000 )
    );
  }

}

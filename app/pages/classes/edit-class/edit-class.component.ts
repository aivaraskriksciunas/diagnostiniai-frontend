import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastNotificationService, Notification, NotificationType } from '../../shared/services/toast-notification.service';
import { UserModel, AuthenticationService } from '../../../shared/services/authentication.service';
import { UsersService } from '../../../shared/services/users.service';
import { DateTime } from 'luxon';
import { IGradeGroupEdit, ClassesService } from 'src/app/shared/services/classes.service';
import { TrimesterState } from 'src/app/shared/states/trimesters.state';
import { SchoolYearModel } from 'src/app/shared/models/trimester.model';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { Router } from '@angular/router';

interface SchoolYearChoice {
    start_year: number,
    end_year: number,
    id: number
}

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.scss', '../../shared/styles/pages.styles.scss']
})
export class EditClassComponent implements OnInit {

  @Input( 'grade-group' ) public gradeGroup : IGradeGroupEdit; 
  public form : FormGroup;
  public userList : UserModel[];
  public schoolYearList : SchoolYearChoice[] = null;

  constructor(
    private classesService : ClassesService,
    private toastService : ToastNotificationService,
    private userService : UsersService,
    private trimesterState : TrimesterState,
    private formBuilder : FormBuilder,
    private authService : AuthenticationService,
    private currentTrimester : CurrentTrimesterState,
    private router : Router
  ) { }

  ngOnInit() {
    if ( this.gradeGroup == null ) {
      this.gradeGroup = {
        grade: 1,
        letter: '',
        head_teacher: null,
        school_year: null,
      }
    }

    this.form = this.formBuilder.group({
      grade: [ this.gradeGroup.grade,
        [ Validators.required, Validators.min( 1 ), Validators.max( 4 ) ] ],
      letter: [ this.gradeGroup.letter,
        [ Validators.required, Validators.maxLength( 1 ), Validators.minLength( 1 ) ] ],
      head_teacher: [ this.gradeGroup.head_teacher,
        [ Validators.required ] ],
      school_year: [ { value: this.gradeGroup.school_year, disabled: true } ,
        [ Validators.required ] ],
      should_redirect: [ true ],
    })

    // Automatically set the current school year if creating class
    if ( this.gradeGroup.id == null ) {
      this.currentTrimester.getState().subscribe(
        t => {
          if ( t && t.isSelected ) {
            this.form.get( 'school_year' ).setValue( t.year.id );
          }
        }
      )
    }

    // Get a list of school years and convert it into SchoolYearChoice
    this.trimesterState.getState().subscribe(
      data => {
        this.schoolYearList = data.school_years.map(
          ( val : SchoolYearModel ) : SchoolYearChoice => {
            return {
              start_year: DateTime.fromSQL( val.start_date ).year,
              end_year: DateTime.fromSQL( val.end_date ).year,
              id: val.id
            };
          }
        )
      }
    );

    if ( this.authService.authenticatedUser.role == 'ADMIN' ) {
      // Get a list of users
      this.userService.getFullUserList().subscribe(
        result => {
          this.userList = result;
        },
        _ => this.toastService.pushErrorNotification( "Klaida!", "Nepavyko gauti vartotojų sąrašo", 8000 )
      );
    }
    else {
      // Otherwise, the list of users will contain only the current one
      this.userList = [ this.authService.authenticatedUser ]
    }
    
  }

  saveClass() {
    this.form.markAllAsTouched();
    if ( !this.form.valid ) {
      return;
    }

    let finalObj : IGradeGroupEdit = {
      grade: this.form.get( 'grade' ).value,
      letter: this.form.get( 'letter' ).value,
      head_teacher: this.form.get( 'head_teacher' ).value,
      school_year: this.form.get( 'school_year' ).value,
      id: this.gradeGroup.id
    }

    let notification = this.toastService.pushAjaxLoadingNotification();

    this.classesService.saveClass( finalObj ).subscribe(
      res => {
        notification.title = "";
        if ( this.gradeGroup.id == null ) {
          notification.message = `Klasė ${finalObj.grade}${finalObj.letter} sėkmingai sukurta`;
        }
        else {
          notification.message = `Klasė ${finalObj.grade}${finalObj.letter} sėkmingai atnaujinta`;
        }
        notification.timeout = 5000;
        notification.type = NotificationType.SUCCESS;
        this.toastService.updateNotification( notification );

        // Reset form inputs
        if ( this.gradeGroup.id == null ) {
          this.form.get( 'grade' ).setValue( '1' );
          this.form.get( 'letter' ).setValue( '' );
          this.form.get( 'head_teacher' ).setValue( '' );
        }

        if ( this.form.get( 'should_redirect' ).value ) {
          this.router.navigate([ '/class', res.id ]);
        }
      },
      () => {
        notification.title = "Klaida";
        if ( this.gradeGroup.id == null ) {
          notification.message = `Nepavyko sukurti klasės. Patikrinkite įvestus duomenis ir bandykite dar kartą`;
        }
        else {
          notification.message = `Nepavyko atnaujinti klasės. Patikrinkite įvestus duomenis ir bandykite dar kartą`;
        }
        notification.timeout = 10000;
        notification.type = NotificationType.ERROR;
        this.toastService.updateNotification( notification );
      }
    )
  }

}

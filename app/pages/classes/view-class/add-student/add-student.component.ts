import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GradeGroupDetail, GradeGroupModel, GradeGroupStudent } from '../../../../shared/models/grade-group.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastNotificationService, NotificationType } from '../../../shared/services/toast-notification.service';
import { StudentsService } from 'src/app/shared/services/students.service';
import { IStudentEdit } from '../../../../shared/services/students.service';
import { ClassesService } from 'src/app/shared/services/classes.service';
import { TrimesterState } from '../../../../shared/states/trimesters.state';
import { DateTime } from 'luxon';
import _ from 'lodash';

enum NewStudentActions {
  NONE = 'NONE',
  CREATE_STUDENT = 'CREATE_STUDENT',
  MOVE_STUDENT = 'MOVE_STUDENT'
}

interface ISchoolYearChoice {
  id: number,
  start_year: number,
  end_year: number
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss', '../../../shared/styles/pages.styles.scss']
})
export class AddStudentComponent implements OnInit {

  @Input( 'gradeGroup' ) public gradeGroup : GradeGroupDetail;
  @Output( 'studentAdded' ) studentAdded : EventEmitter<void> = new EventEmitter<void>();
  public addStudentAction : NewStudentActions = NewStudentActions.NONE;

  public createStudentForm : FormGroup;

  // Variables for move student form
  public moveStudentForm : FormGroup;
  public schoolYearList : ISchoolYearChoice[]; 
  public classesList : GradeGroupModel[] = [];
  public classStudents : GradeGroupStudent[] = [];

  constructor(
    private formBuilder : FormBuilder,
    private toastService : ToastNotificationService,
    private studentsService : StudentsService,
    private classesService : ClassesService,
    private trimesterState : TrimesterState
  ) { }

  ngOnInit() {
    this.createStudentForm = this.formBuilder.group({
      'first_name': [ '', Validators.required ],
      'last_name': [ '', Validators.required ]
    })

    this.moveStudentForm = this.formBuilder.group({
      'year': [ null, {
        validators: Validators.required 
      } ],
      'gradeGroup': [ 0, Validators.required ],
      'student': [ 0, Validators.required ]
    });

    this.moveStudentForm.get( 'year' ).valueChanges.subscribe(
      val => this.schoolYearChanged( val )
    )
    this.moveStudentForm.get( 'gradeGroup' ).valueChanges.subscribe(
      val => this.classChanged( val )
    )

    // Get a list of school years
    this.trimesterState.getState().subscribe(
      data => this.schoolYearList = data.school_years.map(
        val => { return {
          id: val.id,
          start_year: DateTime.fromSQL( val.start_date ).year,
          end_year: DateTime.fromSQL( val.end_date ).year
        }}
      )
    );
  }

  startCreatingStudent() {
    this.addStudentAction = NewStudentActions.CREATE_STUDENT;
  }

  startMovingStudent() {
    this.addStudentAction = NewStudentActions.MOVE_STUDENT;
  }

  cancelStudentAction() {
    this.addStudentAction = NewStudentActions.NONE;
  }

  get firstName() {
    return this.createStudentForm.get( 'first_name' );
  }

  get lastName() {
    return this.createStudentForm.get( 'last_name' );
  }

  createStudent() {
    this.createStudentForm.markAllAsTouched();
    if ( this.createStudentForm.invalid ) {
      this.toastService.pushErrorNotification( '', 'Prašome užpildyti visus reikiamus duomenis apie mokinį', 8000 );
      return;
    };

    let student : IStudentEdit = {
      first_name: this.firstName.value,
      last_name: this.lastName.value
    }

    let toast = this.toastService.pushAjaxLoadingNotification();

    // First, create the student
    this.studentsService.createStudent( student ).subscribe(
      st => {
        toast.message = `Mokinys priskiriamas klasei ${this.gradeGroup.grade}${this.gradeGroup.letter}...`;
        this.toastService.updateNotification( toast );

        // Now, add the student to this class
        this.classesService.addStudents( this.gradeGroup.id, {
          students_list: [
            st.id
          ]
        } )
        .subscribe(
          _ => {
            toast.title = "Mokinys sukurtas";
            toast.message = `Mokinys sukurtas ir priskirtas klasei ${this.gradeGroup.grade}${this.gradeGroup.letter}`;
            toast.timeout = 7000;
            toast.type = NotificationType.SUCCESS;
            this.toastService.updateNotification( toast );
            // Reset form
            this.firstName.setValue( "" );
            this.lastName.setValue( "" );
            this.createStudentForm.markAsUntouched();
            this.studentAdded.emit();
          },
          _ => {
            toast.title = "Klaida";
            toast.message = `Įvyko klaida ir mokinys nebuvo priskirtas klasei ${this.gradeGroup.grade}${this.gradeGroup.letter}`;
            toast.timeout = 10000;
            toast.type = NotificationType.ERROR;
            this.toastService.updateNotification( toast );
          }
        )
      },
      _ => {
        toast.title = "Klaida!";
        toast.message = "Nepavyko sukurti mokinio. Patikrinkite įvestus duomenis ir bandykite vėl";
        toast.timeout = 12000;
        toast.type = NotificationType.ERROR;
        this.toastService.updateNotification( toast );
      }
    ) 
  }

  
  get selectedYear() {
    return this.moveStudentForm.get( 'year' )
  }

  get selectedClass() {
    return this.moveStudentForm.get( 'gradeGroup' )
  }

  get selectedStudent() {
    return this.moveStudentForm.get( 'student' )
  }


  schoolYearChanged( year : any ) {
    this.classesService.getClassesList( {
      year_id: year,
      all: true,
    } ).subscribe(
      list => {
        this.classesList = list
        // Remove current class from the list
        this.classesList = this.classesList.filter( val => val.id != this.gradeGroup.id );
        this.classesList = _.sortBy( this.classesList, [ c => c.grade, c => c.letter ]);
        this.classStudents = [];
        this.selectedClass.setValue( 0 );
      }
    )
  }

  classChanged( group : any ) {
    if ( group == 0 ) return;

    this.classesService.getClassDetail( group ).subscribe(
      res => {
        this.classStudents = res.students
        this.classStudents = _.sortBy( this.classStudents, [ s => s.last_name, s => s.first_name ] );
        this.selectedStudent.setValue( 0 )
      }
    )
  }

  moveStudent() {
    let student = this.selectedStudent.value;
    if ( student == 0 ) {
      this.toastService.pushErrorNotification( '', "Prašome pasirinkti mokinį", 8000 );
      return;
    }

    let toast = this.toastService.pushAjaxLoadingNotification();

    this.classesService.addStudents( this.gradeGroup.id, {
      students_list: [ student ],
      move_students: true
    } )
    .subscribe(
      res => {
        toast.title = "";
        toast.message = res[0].message;

        if ( res[0].success ) {
          toast.timeout = 7000;
          toast.type = NotificationType.SUCCESS;
        }
        else {
          toast.timeout = 10000;
          toast.type = NotificationType.ERROR;
        }
        this.toastService.updateNotification( toast );
        this.studentAdded.emit();
      },
      _ => {
        toast.title = "Klaida"
        toast.message = "Nepavyko perkelti mokinio į klasę";
        toast.timeout = 10000;
        toast.type = NotificationType.ERROR;
        this.toastService.updateNotification( toast );
      }
    )
  }

}

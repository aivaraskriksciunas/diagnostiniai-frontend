import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ClassesService } from 'src/app/shared/services/classes.service';
import { TrimesterService } from '../../../shared/services/trimester.service';
import { GradeGroupModel } from '../../../shared/models/grade-group.model';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { GroupsService } from '../../../shared/services/groups.service';
import { ActivatedRoute } from '@angular/router';
import { CourseGroupDetailModel } from '../../../shared/models/course-group.model';
import _ from 'lodash';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss', '../../shared/styles/pages.styles.scss']
})
export class AddStudentComponent implements OnInit {

  public group : CourseGroupDetailModel;

  public form : FormGroup;
  public isLoading : boolean = true;
  public isStudentsLoading : boolean = false;

  private school_year_id : number;

  public classesList : GradeGroupModel[] = [];

  // Which value to set to is_selected input value, after user selects the checkbox in table header
  private setAllValue = true;

  constructor(
    private fb : FormBuilder,
    private classesService : ClassesService,
    private trimesterService : TrimesterService,
    private toastService : ToastNotificationService,
    private groupService : GroupsService,
    private route : ActivatedRoute
  ) { 
  }

  ngOnInit() {
    this.form = this.fb.group({
      'gradeGroup': '',
      'students': this.fb.array([])
    });

    this.route.params.subscribe(
      params => {
        this.fetchGroup( params['group_id'] );
      }
    )

    
  }

  private fetchGroup( groupId : number | string ) {
    // Get the school year of the selected group
    this.isLoading = true;
    this.groupService.getGroupDetail( groupId ).subscribe(
      group => {
        this.group = group;
        this.trimesterService.getTrimester( group.trimester ).subscribe(
          trimester => {
            this.school_year_id = trimester.school_year;
            this.isLoading = false;
    
            this.getClassesList();
          }
        );
      }
    );
  }

  public getClassesList() {
    this.classesService.getClassesList( {
        year_id: this.school_year_id,
        all: true
      } ).subscribe(
      list => {
        this.classesList = _.sortBy( list, [ c => c.grade, c => c.letter ] );
      }
    )
  }

  public getStudentsList() {
    this.isStudentsLoading = true;
    let classId = this.form.get( 'gradeGroup' ).value;
    this.form.setControl( 'students', this.fb.array([]) );

    // Reset the value that all checkboxes will be set to when the user clicks on the checkbox in the header
    this.setAllValue = true;

    this.classesService.getClassDetail( classId ).subscribe(
      c => {
        // Create a form entry for each student
        c.students.forEach(
          val => {
            // Make sure this student is not already added to this group
            if ( this.group.students.find( s => s.id == val.id ) ) {
              return;
            }

            this.classStudents.push( this.fb.group({
              'id': val.id,
              'first_name': val.first_name,
              'last_name': val.last_name,
              'is_selected': false
            }) );
          }
        )
        this.isStudentsLoading = false;
      }
    )
  }

  public get classStudents() {
    return this.form.get( 'students' ) as FormArray;
  }

  public studentSelected( i : number ) {
    this.classStudents.controls[i].get( 'is_selected' ).setValue( 
      !this.classStudents.controls[i].get( 'is_selected' ).value 
    );
  }

  public selectAll() {
    this.classStudents.controls.forEach(
      control => control.get( 'is_selected' ).setValue( this.setAllValue )
    )

    this.setAllValue = !this.setAllValue;
  }

  public addStudents() {
    let students = this.classStudents.controls.map(
      val => val.value
    ).filter(
      val => val.is_selected
    );

    let toast = this.toastService.pushAjaxLoadingNotification();

    this.groupService.addStudents( this.group.id, students.map( st => st.id ) )
    .subscribe(
      res => {
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
        this.fetchGroup( this.route.snapshot.paramMap.get( 'group_id' ) );
        this.getStudentsList();
      },
      _ => {
        toast.title = "Klaida"
        toast.message = "Nepavyko perkelti mokinio į grupę";
        toast.timeout = 10000;
        toast.type = NotificationType.ERROR;
        this.toastService.updateNotification( toast );
      }
    )
  }

}

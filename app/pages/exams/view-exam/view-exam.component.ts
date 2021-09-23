import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ExamsService, IEditGrade } from '../../../shared/services/exams.service';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '../../../shared/services/groups.service';
import { CourseGroupDetailModel, CourseGroupStudent } from '../../../shared/models/course-group.model';
import { ExamDetailModel } from 'src/app/shared/models/exam.model';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ExamMarkModel } from '../../../shared/models/exam.model';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';

@Component({
  selector: 'app-view-exam',
  templateUrl: './view-exam.component.html',
  styleUrls: ['./view-exam.component.scss', '../../shared/styles/pages.styles.scss']
})
export class ViewExamComponent implements OnInit {

  public group : CourseGroupDetailModel;
  public exam : ExamDetailModel; 
  public isLoading : boolean = false;

  public form : FormGroup;

  constructor(
    private examService: ExamsService,
    private activatedRoute : ActivatedRoute,
    private groupService : GroupsService,
    private formBuilder : FormBuilder,
    private toastService : ToastNotificationService,
    private location : Location
  ) { 
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        this.getExamInfo( paramMap.get( 'id' ) );
      }
    )
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'grades': this.formBuilder.array([])
    });
  }

  private createGradeInput( student : CourseGroupStudent ) : FormGroup {
    
    // Try to find the student's mark in the exam detail
    let studentGrade = this.exam.marks.find(
      ( val : ExamMarkModel ) => val.student.id == student.id
    );

    return this.formBuilder.group({
      id: student.id,
      first_name: student.first_name,
      last_name: student.last_name,
      grade: [ studentGrade == null ? '' : studentGrade.mark, [ Validators.max( this.exam.max_score ), Validators.min( this.exam.min_score ) ] ]
    });
  }

  private createGradeInputList( group : CourseGroupDetailModel ) {
    // First, empty the current list, if any
    this.form.setControl( 'grades', this.formBuilder.array([]) );
    let formArray = this.form.get( 'grades' ) as FormArray;

    // Sort student list
    group.students.sort( ( a, b ) => a.last_name.localeCompare( b.last_name ) );

    // Push new form controls to the list
    for ( let i = 0; i < group.students.length; i++ ) {
      formArray.push( this.createGradeInput( group.students[i] ) );
    }

  }

  private getExamInfo( examId : number | string ) {
    this.examService.getExamDetail( examId ).subscribe(
      res => {
        this.exam = res;
        // Now, get the group information along with all the students
        this.getGroupInfo( this.exam.group );
      }
    )
  }

  private getGroupInfo( groupId : number | string ) {
    this.groupService.getGroupDetail( groupId ).subscribe(
      res => {
        this.group = res;
        this.createGradeInputList( res );
        this.isLoading = false;
      }
    )
  }

  public saveGrades() {
    if ( this.form.valid == false ) {
      this.toastService.pushErrorNotification( "Klaida", "Nepavyko išsaugoti balų, nes duomenys yra klaidingi. Patikrinkite įvestus balus ir bandykite dar kartą", 12000 );
      return;
    }

    let savedGrades = ( this.form.get( 'grades' ) as FormArray ).controls;
    let gradesList : IEditGrade[] = [];

    
    for ( let i = 0; i < savedGrades.length; i++ ) {
      if ( savedGrades[i].value.grade != '' ) {
        gradesList.push( {
          value: savedGrades[i].value.grade,
          student: savedGrades[i].value.id
        } );
      }
    }

    let toast = this.toastService.pushAjaxLoadingNotification();
    // Send notification
    this.examService.setGrade( this.exam.id, gradesList ).subscribe(
      res => {
        // Get all the failed requests
        let bad_requests = res.filter( val => val.success == false );
        // Display error messages
        bad_requests.forEach(
          val => {
            // First, get the student name 
            let student = this.group.students.find( stud => stud.id == val.student );
            // Now tell what was the error
            this.toastService.pushErrorNotification( 
              "Klaida įrašant pažymį", 
              `Nepavyko išsaugoti pažymio mokiniui '${student.first_name} ${student.last_name}': ${val.message}`,
              10000
            );
          }
        );

        toast.title = "Užklausa įvykdyta";
        toast.message = "";
        toast.type = NotificationType.SUCCESS;
        toast.timeout = 6000;
        this.toastService.updateNotification( toast );

        if ( bad_requests.length == 0 ) {
          this.location.back();
        }
      },
      _ => {
        toast.title = "Klaida";
        toast.message = "Klaida vykdgant užklausą. Patikrinkite įvestus duomenis ir bandykite dar kartą";
        toast.type = NotificationType.ERROR;
        toast.timeout = 10000;
        this.toastService.updateNotification( toast );
      }
    )
  }

}

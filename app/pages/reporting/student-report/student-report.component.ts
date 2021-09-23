import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StudentModel } from '../../../shared/models/student.model';
import { CurrentTrimesterState } from 'src/app/shared/states/current-trimester.state';
import { GradeGroupModel } from 'src/app/shared/models/grade-group.model';
import { ClassesService } from '../../../shared/services/classes.service';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';
import { ReportingService } from 'src/app/shared/services/reporting.service';
import Chart from 'chart.js';
import 'chartjs-plugin-labels';
import { SelectItem } from '../../shared/components/multiple-select/multiple-select.component';
import { SubjectsService } from '../../../shared/services/subjects.service';

@Component({
  selector: 'app-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.scss', '../../shared/styles/pages.styles.scss']
})
export class StudentReportComponent implements OnInit {

  @ViewChild( 'chart', {static: true} ) public chartObj : ElementRef;
  private chart : any;

  public groups : GradeGroupModel[] = [];
  public students : StudentModel[] = [];

  public subjectChoices : SelectItem[] = [];

  public selectedGroup : number = 0;
  public selectedStudent : number = 0;
  public selectedSubjects : number[] = [];

  public isGroupsLoading : boolean = true;
  public isStudentsLoading : boolean = false;

  public studentMarks : any[] = [];

  constructor(
    private groupService : ClassesService,
    private trimesterState : CurrentTrimesterState,
    private toastService : ToastNotificationService,
    private reportingService : ReportingService,
    private subjectService : SubjectsService
  ) { 
    this.subjectService.getSubjectList().subscribe( list => this.subjectChoices = list.map<SelectItem>(
      l => ({
        value: l.id,
        text: l.name
      })
    ) )
  }

  ngOnInit() {
    this.trimesterState.getState().subscribe(
      data => {
        if ( data.isSelected == false ) return;

        this.fetchGradeGroups( data.year.id )
      }
    )

    this.initChart();
  }

  private fetchGradeGroups( year_id : number ) {
    this.isGroupsLoading = true;
    this.groupService.getClassesList({
      year_id: year_id
    }).subscribe(
      list => this.groups = list,
      _ => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti klasių sąrašo. Bandykite dar kartą", 10000 ),
      () => { this.isGroupsLoading = false; this.selectedStudent = 0 }
    )
  }

  public fetchStudents() {
    if ( this.selectedGroup == 0 ) return;

    this.isStudentsLoading = true;

    this.groupService.getClassDetail( this.selectedGroup ).subscribe(
      detail => this.students = detail.students,
      _ => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti mokinių sąrašo. Bandykite dar kartą", 10000 ),
      () => this.isStudentsLoading = false
    );
  }

  public subjectsSelected( selectedSubjects ) {
    this.selectedSubjects = selectedSubjects;
  }

  public fetchTestResults() {
    if ( this.selectedStudent == 0 || this.selectedSubjects.length == 0 ) return;
    
    this.reportingService.getStudentReport( this.selectedStudent, this.selectedSubjects ).subscribe(
      marks => {
        this.studentMarks = marks
        this.updateChart()
      },
      _ => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti mokinio duomenų iš serverio. Bandykite dar kartą", 10000 )
    )
  }

  public downloadGraphData() {
    this.reportingService.downloadStudentReport( this.selectedStudent, this.selectedSubjects ).subscribe(
      () => {},
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti failo iš serverio. Bandykite dar kartą", 10000 )
    )
  }

  private initChart() {
    let context = this.chartObj.nativeElement.getContext( '2d' );
    this.chart = new Chart( context, {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        scales: {
            yAxes: [{
              ticks: {
                min: 0,
                max: 100,
                beginAtZero: true
              }
            }],
            xAxes: [{

              maxBarThickness: 60,
            }]
        },
        plugins: {
          labels: {
            render: ( args ) => (+args.value).toFixed( 2 ) + "%"
          }
        },
        tooltips: {
          callbacks: {
            label: ( item, data ) => (+item.value).toFixed( 2 ) + "%"
          }
        },
      }
    })
  }

  private updateChart() {
    this.chart.data.labels = this.studentMarks.map(
      v => [ v.exam.name, v.exam.subject_name, v.exam.trimester_name ]
    );

    this.chart.data.datasets[0] = {
      label: 'Balai, %',
      data: this.studentMarks.map( val => ( ( val.mark + val.exam.min_score ) / val.exam.max_score ) * 100 ),
      backgroundColor: '#2196F3aa',
      borderColor: '#2196F333',
      borderWidth: 1,
    }

    this.chart.update();

  }

}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClassesService } from '../../../shared/services/classes.service';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { SelectItem, CheckboxState } from '../../shared/components/multiple-select/multiple-select.component';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';
import { GradeGroupDetail } from '../../../shared/models/grade-group.model';
import { map } from 'rxjs/operators';
import { ExamsService } from '../../../shared/services/exams.service';
import { ReportingService } from '../../../shared/services/reporting.service';
import Chart from 'chart.js';
import 'chartjs-plugin-labels';

@Component({
  selector: 'app-student-group-report',
  templateUrl: './student-group-report.component.html',
  styleUrls: ['./student-group-report.component.scss', '../../shared/styles/pages.styles.scss']
})
export class StudentGroupReportComponent implements OnInit {

  @ViewChild( 'chartContext', {static: true} ) public chartContext : ElementRef;

  public classesLoading : boolean = true;
  public classesChoices : SelectItem[] = [];
  public subject : number = 0;
  public availableExamChoices : SelectItem[] = [];
  public examsLoading : boolean = true;

  public selectedStudents : number[] = [];
  public selectedExams : number[] = [];

  public chartLoading : boolean = false;
  public chart = null;

  constructor(
    private classService : ClassesService,
    private currentTrimesterState : CurrentTrimesterState,
    private toastService : ToastNotificationService,
    private examsService : ExamsService,
    private reportingService : ReportingService,
  ) { 
    this.currentTrimesterState.getState().subscribe(
      t => { if ( t == null || t.isSelected == false ) return; this.createChoices( t.year.id ) }
    );
  }

  createChoices( school_year ) {
    this.classesLoading = true;

    let i = 0;

    this.classService.getClassesList({
      year_id: school_year 
    }).subscribe(
      res => {
        this.classesChoices = res.map(
          (l) : SelectItem => ({
            text: l.grade + l.letter,
            value: l.id,
            asyncChildrenLoader: ( value ) => {
              return this.classService.getClassDetail( value ).pipe(
                map( ( detail : GradeGroupDetail ) => detail.students.map(
                  stud => ({
                    text: stud.first_name + ' ' + stud.last_name,
                    value: stud.id,
                  })
                ) ),
              )
            }
          })
        )
      },
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti klasių sąrašo. Perkraukite puslapį ir bandykite dar kartą", 12000 ),
      () => this.classesLoading = false
    )
  }

  ngOnInit() {
  }

  studentsSelected( students ) {
    this.selectedStudents = students;
    if ( students.length == 0 ) {
      return;
    }

    this.getStudentsExamList();
  }

  getStudentsExamList() {

    this.examsLoading = true;
    this.selectedExams = [];

    this.examsService.getStudentsExams( this.selectedStudents, this.subject ).subscribe(
      ( res ) => { 
        this.availableExamChoices = res.map(
          i => ({
            text: i.human_name,
            state: CheckboxState.SELECTED,
            children: i.exams.map(
              e => ({
                text: e.name + ' - ',
                value: e.id,
                state: CheckboxState.SELECTED,
              })
            )
          })
        )
      },
      () => {
        this.toastService.pushErrorNotification( 'Klaida', 'Nepavyko gauti darbų sąrašo iš serverio. Bandykite dar kartą', 12000 )
      }, 
      () => {
        this.examsLoading = false;
      }
    )
  }

  onExamSelect( exams ) {
    this.selectedExams = exams;
  }


  getGraphData() {
    this.chartLoading = true;
    this.reportingService.getStudentGroupReport( this.selectedStudents, this.selectedExams ).subscribe(
      res => this.createGraph( res ),
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti duomenų grafikui sukurti. Bandykite dar kartą", 12000 ),
      () => {
        this.chartLoading = false;
      }
    )
  }

  downloadGraphData() {
    this.reportingService.downloadStudentGroupReport( this.selectedStudents, this.selectedExams ).subscribe(
      () => {},
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti failo iš serverio. Bandykite dar kartą", 10000 )
    )
  }

  private createGraph( data: any[] ) {
    if ( this.chart != null ) this.chart.destroy();

    // generate datasets and labels
    let datasets = [];
    let labels = [];

    // Create labels
    for ( let i = 0; i < data.length; i++ ) {
      labels.push( data[i].name )
    }

    // Now create columns and data
    let currentStack = 1;
    let currentDatasets = [];
    let dataLeft = true;
    while ( dataLeft ) {
      // Take data from the first exam in every semester and store it in currentDatasets
      
      // First, create 4 datasets for each level
      currentDatasets = [
        { 
          stack: currentStack,
          data: [],
          backgroundColor: '#ff4d4daa',
          borderColor: '#ff3838',
          borderWidth: 1,
          label: 'Nepatenkinamas lygmuo'
        },
        { 
          stack: currentStack,
          data: [],
          backgroundColor: '#ffaf40aa',
          borderColor: '#ff9f1a',
          borderWidth: 1,
          label: 'Patenkinamas lygmuo'
        },
        { 
          stack: currentStack,
          data: [],
          backgroundColor: '#32ff7eaa',
          borderColor: '#3ae374',
          borderWidth: 1,
          label: 'Pagrindinis lygmuo'
        },
        { 
          stack: currentStack,
          data: [],
          backgroundColor: '#18dcffaa',
          borderColor: '#17c0eb',
          borderWidth: 1,
          label: 'Aukštesnysis lygmuo'
        }
      ]

      dataLeft = false;

      // Loop through every semester
      for ( let s = 0; s < data.length; s++ ) {
        // Check if this semester is empty (has no tests), if so, skip it
        if ( data[s].exams.length == 0 ) {
          currentDatasets[0].data.push( 0 )
          currentDatasets[1].data.push( 0 )
          currentDatasets[2].data.push( 0 )
          currentDatasets[3].data.push( 0 )
          continue;
        }

        // Create column for this exam
        // Display amount of students in each level
        currentDatasets[0].data.push( data[s].exams[0].levels.NEPATENKINAMAS.students.length )
        currentDatasets[1].data.push( data[s].exams[0].levels.PATENKINAMAS.students.length )
        currentDatasets[2].data.push( data[s].exams[0].levels.PAGRINDINIS.students.length )
        currentDatasets[3].data.push( data[s].exams[0].levels.AUKSTESNYSIS.students.length )

        // Delete the first exam in data, so we don't check it again
        data[s].exams = data[s].exams.slice( 1 )
        
        if ( data[s].exams.length > 0 ) dataLeft = true
      }

      currentStack++;
      datasets = datasets.concat( currentDatasets )
    }

    this.chart = new Chart( this.chartContext.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: ( item, data ) => data.datasets[item.datasetIndex].label + ": " + item.value + " mokiniai"
          }
        },
        scales: {
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            stacked: true,
            maxBarThickness: 50,
            ticks: {
              beginAtZero: true
            }
          }],
        },
        plugins: {
          labels: {
            render: ( args ) => {
              // showZero option does not hide 0 for some reason
              if ( args.value != 0 ) {
                return args.value;
              }
              return '';
            },
          }
        }
      }
    });
  }
}

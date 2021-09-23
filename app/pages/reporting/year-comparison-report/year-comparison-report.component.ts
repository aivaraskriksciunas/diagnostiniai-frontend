import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectItem } from '../../shared/components/multiple-select/multiple-select.component';
import { TrimesterState } from '../../../shared/states/trimesters.state';
import { ReportingService } from 'src/app/shared/services/reporting.service';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-year-comparison-report',
  templateUrl: './year-comparison-report.component.html',
  styleUrls: ['./year-comparison-report.component.scss', '../../shared/styles/pages.styles.scss']
})
export class YearComparisonReportComponent implements OnInit {
  @ViewChild( 'chartContext', {static: true} ) public chartContext : ElementRef;

  public subject : number = 0;
  public grade : number = 1;
  public availableSemesters : SelectItem[] = [];
  public selectedSemesters : number[] = [];
  public isDiagnostinis : boolean = false;

  public chart : any = null;
  public isChartLoading : boolean = false;

  constructor(
    private trimesterState : TrimesterState,
    private reportingService : ReportingService,
    private toastService : ToastNotificationService
  ) { 
    this.trimesterState.getState().subscribe(
      res => this.availableSemesters = res.school_years.map(
        ( year ) : SelectItem => ({
          text: year.human_readable_name,
          children: year.trimesters.map(
            ( tri ) : SelectItem => ({
              text: tri.human_readable_name,
              value: tri.id
            })
          )
        })
      )
    )
  }

  ngOnInit() {
  }

  public onSemesterSelect( semesters ) {
    this.selectedSemesters = semesters;

  }

  public getGraphData() {
    this.isChartLoading = true;
    this.reportingService.getYearlyReport( this.subject, this.grade, this.selectedSemesters, this.isDiagnostinis ).subscribe(
      res => this.createChart( res ),
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti duomenų iš serverio", 15000 )
    )
  }

  public downloadData() {
    this.reportingService.downloadYearlyReport( this.subject, this.grade, this.selectedSemesters, this.isDiagnostinis ).subscribe(
      () => {},
      () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko sukurti .xlsx failo. Patikrinkite įvestus duomenis ir bandykite dar kartą", 12000 )
    )
  }

  private createChart( data: any ) {
    if ( this.chart != null ) {
      this.chart.destroy();
    }

    // Create labels
    let labels = [];
    for ( let i = 0; i < data.length; i++ ) {
      labels.push( data[i].name )
    }

    // Now create columns and data
    let datasets = [
      { 
        stack: 1,
        data: [],
        backgroundColor: '#ff4d4daa',
        borderColor: '#ff3838',
        borderWidth: 1,
        label: 'Nepatenkinamas lygmuo'
      },
      { 
        stack: 1,
        data: [],
        backgroundColor: '#ffaf40aa',
        borderColor: '#ff9f1a',
        borderWidth: 1,
        label: 'Patenkinamas lygmuo'
      },
      { 
        stack: 1,
        data: [],
        backgroundColor: '#32ff7eaa',
        borderColor: '#3ae374',
        borderWidth: 1,
        label: 'Pagrindinis lygmuo'
      },
      { 
        stack: 1,
        data: [],
        backgroundColor: '#18dcffaa',
        borderColor: '#17c0eb',
        borderWidth: 1,
        label: 'Aukštesnysis lygmuo'
      }
    ]

    // Loop through every semester
    for ( let s = 0; s < data.length; s++ ) {
      // Display % of students in each level
      datasets[0].data.push( data[s].results.NEPATENKINAMAS )
      datasets[1].data.push( data[s].results.PATENKINAMAS )
      datasets[2].data.push( data[s].results.PAGRINDINIS )
      datasets[3].data.push( data[s].results.AUKSTESNYSIS )
    }


    this.chart = new Chart( this.chartContext.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        legend: {
          display: true
        },
        tooltips: {
          callbacks: {
            label: ( item, data ) => data.datasets[item.datasetIndex].label + ": " + item.value + "%"
          }
        },
        plugins: {
          labels: {
            render: ( args ) => {
              if ( args.value == 0 ) {
                return ''
              }
              return (+args.value).toFixed( 1 )
            }
          }
        },
        scales: {
          yAxes: [{
            stacked: true,
            labelString: '% įvertinimų',
            ticks: {
              beginAtZero: true,
              callback: ( value ) => value + "%",
              min: 0,
              max: 100
            }
          }],
          xAxes: [{
            stacked: true,
            maxBarThickness: 50,
            ticks: {
              beginAtZero: true
            }
          }],
        }
      }
    })

    this.isChartLoading = false;
  }

}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TrimesterService } from 'src/app/shared/services/trimester.service';
import { DateTime } from 'luxon';
import flatpickr from 'flatpickr';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { SchoolYearModel } from 'src/app/shared/models/trimester.model';

@Component({
  selector: 'app-school-years-list',
  templateUrl: './school-years-list.component.html',
  styleUrls: ['./school-years-list.component.scss', '../../shared/styles/pages.styles.scss']
})
export class SchoolYearsListComponent implements OnInit {

  public schoolYears: SchoolYearModel[] = [];
  public selectedYearIndex: number;
  public migrateGroups : boolean = true;
  public migrateClasses : boolean = true;

  @ViewChild( 'startDatePicker', {static: false} ) startDateInput : ElementRef;
  @ViewChild( 'endDatePicker', {static: false} ) endDateInput : ElementRef;
  @ViewChild( 'startYearDatePicker', {static: false} ) startYearDateInput : ElementRef;
  @ViewChild( 'endYearDatePicker', {static: false} ) endYearDateInput : ElementRef;

  private triStartDatePicker;
  private triEndDatePicker;
  private yearStartDatePicker;
  private yearEndDatePicker;

  private flatpickrConfig = {
    dateFormat: 'Y-m-d'
  };

  constructor( 
    private trimesterService: TrimesterService,
    private notificationService: ToastNotificationService ) { }

  ngOnInit() {
    this.trimesterService.getTrimesters().subscribe(
      result => {
        this.schoolYears = result;
        this.setupDateFields( result );
      }
    )
  }

  public getYear( date : string ) {
    return new Date( date ).getFullYear();
  }

  public get selectedYear() {
    return this.schoolYears[this.selectedYearIndex];
  }

  // Authomatically fill out year and trimester fields, so user has to type in less
  // Also will setup flatpickr on those fields
  public setupDateFields( schoolYears : SchoolYearModel[] ) {
    // Create datepicker objects on fields
    
    this.yearStartDatePicker = flatpickr( this.startYearDateInput.nativeElement, this.flatpickrConfig );
    this.yearEndDatePicker = flatpickr( this.endYearDateInput.nativeElement, this.flatpickrConfig );
    this.triStartDatePicker = flatpickr( this.startDateInput.nativeElement, this.flatpickrConfig );
    this.triEndDatePicker = flatpickr( this.endDateInput.nativeElement, this.flatpickrConfig );

    // School years and trimesters come already sorted from the server
    let latestYear = schoolYears[0];
    // Automatically suggest next schoolyear start and end dates, based on previous year
    this.yearStartDatePicker.setDate( DateTime.fromSQL( latestYear.start_date ).plus( { years: 1 } ).toSQLDate() );
    this.yearEndDatePicker.setDate( DateTime.fromSQL( latestYear.end_date ).plus( { years: 1 } ).toSQLDate() );
    
    this.updateTrimesterDateFields()
  }

  public updateTrimesterDateFields() {
    if ( this.selectedYear == null ) return;

    this.triStartDatePicker.set( 'maxDate', this.selectedYear.end_date );
    this.triEndDatePicker.set( 'maxDate', this.selectedYear.end_date );

    if ( this.selectedYear.trimesters.length <= 0 ) {
      // If there are no trimesters for this year, set trimester start date to year start date
      this.triStartDatePicker.set( 'minDate', this.selectedYear.start_date );
      this.triEndDatePicker.set( 'minDate', this.selectedYear.start_date );
      this.triStartDatePicker.setDate( this.selectedYear.start_date );
    }
    else {
      // Set trimester start date to last trimester end date
      let latestTrimester = this.selectedYear.trimesters[this.selectedYear.trimesters.length - 1];
      this.triStartDatePicker.set( 'minDate', latestTrimester.end_date );
      this.triEndDatePicker.set( 'minDate', latestTrimester.end_date );
      this.triStartDatePicker.setDate( latestTrimester.end_date );
    }

  }

  public saveSchoolYear() {
    let notification = this.notificationService.pushInfoNotification( "", "Kuriami nauji mokslo metai...", 0 );
    
    this.trimesterService.addSchoolYear({
      start_date: DateTime.fromJSDate( this.yearStartDatePicker.selectedDates[0] ).toSQLDate(),
      end_date: DateTime.fromJSDate( this.yearEndDatePicker.selectedDates[0] ).toSQLDate(),
    }, this.migrateClasses ).subscribe(
      res => {
        notification.message = "Nauji mokslo metai išsaugoti";
        notification.type = NotificationType.SUCCESS;
        notification.timeout = 2000;
        this.notificationService.updateNotification( notification );
      },
      err => {
        notification.title = "Klaida!";
        notification.message = "Nepavyko išsaugoti naujų mokslo metų. Bandykite iš naujo";
        notification.type = NotificationType.ERROR;
        notification.timeout = 5000;
        this.notificationService.updateNotification( notification );
      }
    )
  }

  public saveTrimester() {
    let notification = this.notificationService.pushInfoNotification( "", "Kuriamas naujas pusmetis...", 0 );

    this.trimesterService.addTrimester( {
      start_date: DateTime.fromJSDate( this.triStartDatePicker.selectedDates[0] ).toSQLDate(),
      end_date: DateTime.fromJSDate( this.triEndDatePicker.selectedDates[0] ).toSQLDate(),
      school_year: this.selectedYear.id
    }, this.migrateGroups ).subscribe(
      res => {
        notification.message = "Naujas pusmetis sukurtas";
        notification.type = NotificationType.SUCCESS;
        notification.timeout = 2000;
        this.notificationService.updateNotification( notification );
      },
      err => {
        notification.title = "Klaida!";
        notification.message = "Nepavyko išsaugoti naujo pusmečio. Bandykite iš naujo";
        notification.type = NotificationType.ERROR;
        notification.timeout = 5000;
        this.notificationService.updateNotification( notification );
      }
    );
  }

}

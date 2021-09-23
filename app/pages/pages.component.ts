import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UserModel } from '../shared/services/authentication.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TrimesterState, IYearTrimesterData } from '../shared/states/trimesters.state';
import { ToastNotificationService } from './shared/services/toast-notification.service';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { TrimesterModel, SchoolYearModel } from '../shared/models/trimester.model';
import { StateService } from '../shared/services/state.service';
import { CurrentTrimesterState, CurrentTrimester } from '../shared/states/current-trimester.state';
import { Observable, interval, Subscription } from 'rxjs';

interface TrimesterChoice {
  id: number,
  index: string
}

interface SchoolYearChoice { 
  start_year: number,
  end_year: number,
  trimesters: TrimesterChoice[]
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {

  public user: UserModel;
  public selectedTrimesterText : string = "Pasirinkite pusmetį";
  public selectedTrimester : TrimesterModel = null
  public trimesterChoices : SchoolYearChoice[];

  private tokenRefreshSubscription : Subscription = null;

  constructor( 
    private authService: AuthenticationService,
    private router: Router,
    private trimestersState : TrimesterState,
    private currentTrimesterState : CurrentTrimesterState, 
    private stateService : StateService,
    private toastService : ToastNotificationService ) 
  { 
    // Listen to changes to trimesters
    this.trimestersState.getState().subscribe(
      res => {
        this.createTrimesterChoices( res )

        // Only set the trimester when user reloads the page, and only if no trimester is passed into the url
        if ( !this.currentTrimesterState.getCurrentState().isSelected ) {
          this.autoSelectTrimester( res );
        }
        
        this.setSelectedTrimesterText( this.currentTrimesterState.getCurrentState() )
      }
    );

    this.currentTrimesterState.getState().subscribe(
      state => {
        this.setSelectedTrimesterText( state );

      }
    )

    // Initialize once all the states, through the stateService
    this.stateService.initStates();
  }

  ngOnInit() {
    this.user = this.authService.authenticatedUser;

    // Setup automatic token refresh
    this.tokenRefreshSubscription = interval( 15 * 60 * 1000 ).subscribe(
      () => this.authService.refreshToken().subscribe(
        () => {},
        () => this.toastService.pushErrorNotification( "Klaida", "Nepavyko atnaujinti darbo sesijos. Prašome prisijungti iš naujo", 15000 )
      )
    )
    
  }

  ngOnDestroy(): void {
    this.tokenRefreshSubscription.unsubscribe();
  }

  public logout() {
    this.authService.logout();
    this.router.navigate([ '/auth', 'login' ]);
  }

  // Method to automatically select a trimester for the user
  private autoSelectTrimester( data : IYearTrimesterData ) {
    if ( data.school_years.length == 0 ) return;

    let currentDate = DateTime.local();

    let allTrimesters : TrimesterModel[] = _.flatten( data.school_years.map( ( val ) => val.trimesters ) );
    allTrimesters = allTrimesters.sort( ( a, b ) => DateTime.fromSQL( a.start_date ) < DateTime.fromSQL( b.start_date ) ? 1 : -1 );
    
    // Find the trimester closest to the current date

    // Pick the first date, which will be the latest
    let closestTrimester : TrimesterModel = allTrimesters[0];
    let trimesterDiff = DateTime.fromSQL( closestTrimester.end_date ).diff( currentDate, 'hours' ).toObject().hours;
    
    // Loop through all dates, see if they are closer to the current one
    for ( let i = 1; i < allTrimesters.length; i++ ) {
      let diff = DateTime.fromSQL( allTrimesters[i].end_date ).diff( currentDate, 'hours' ).toObject().hours;
      
      if ( diff >= 0 && diff < trimesterDiff ) {
        // This date is closer to the current one
        closestTrimester = allTrimesters[i];
        trimesterDiff = diff;
      }
      // This date is not closer or behind the current date, so do nothing
      else {
        break;
      }
    }

    // Set the current trimester
    this.currentTrimesterState.setCurrentTrimesterById( closestTrimester.id );
  }

  private createTrimesterChoices( data : IYearTrimesterData ) {
    this.trimesterChoices = data.school_years.map(
      ( s : SchoolYearModel ) : SchoolYearChoice => {
        return {
          start_year: DateTime.fromSQL( s.start_date ).year,
          end_year: DateTime.fromSQL( s.end_date ).year,
          trimesters: s.trimesters.sort( ( a, b ) => a.order > b.order ? 1 : -1 ).map(
            ( t : TrimesterModel, index : number ) : TrimesterChoice => {
              return {
                id: t.id,
                index: ( index + 1 ) + " pusmetis"
              }
            }
          )
        }
      }
    )
  }

  public setSelectedTrimesterText( trimester : CurrentTrimester ) {

    if ( trimester.isSelected == false ) {
      this.selectedTrimesterText = "Pasirinkite pusmetį";
      return;
    };

    let startDate = DateTime.fromSQL( trimester.year.start_date ).year;
    let endDate = DateTime.fromSQL( trimester.year.end_date ).year;
    this.selectedTrimesterText = `${startDate} - ${endDate} ${trimester.trimester.order} pusmetis`;
  }

  public setTrimester( year : SchoolYearChoice, tri : TrimesterChoice ) {
    if ( this.currentTrimesterState.getCurrentState().isSelected &&
        this.currentTrimesterState.getCurrentState().trimester.id == tri.id ) return;
    
    this.currentTrimesterState.setCurrentTrimesterById( tri.id );
    this.router.navigate([ '' ]);
  
  }  

}

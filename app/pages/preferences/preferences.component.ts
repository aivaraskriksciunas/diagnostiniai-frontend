import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PreferencesState } from '../../shared/states/preferences.state';
import { PreferencesService } from '../../shared/services/preferences.service';
import { PreferenceModel } from '../../shared/models/preference.model';
import { switchMap, catchError } from 'rxjs/operators';
import { ToastNotificationService, NotificationType } from '../shared/services/toast-notification.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss', '../shared/styles/pages.styles.scss']
})
export class PreferencesComponent implements OnInit {

  private form : FormGroup = null;
  public isLoading : boolean = true;



  constructor(
    private formBuilder: FormBuilder,
    private prefState: PreferencesState,
    private prefService: PreferencesService,
    private toastService : ToastNotificationService
  ) { 

    this.prefState.getState().subscribe(
      state => this.setupForm( state ) 
    )
  }

  private setupForm( prefs_list : PreferenceModel[] ) {
    this.isLoading = true;

    if ( prefs_list == null ) return;

    let prefs = {};
    prefs_list.forEach(
      p => prefs[p.name] = p.value
    );

    this.form = this.formBuilder.group({
      'NEPATENKINAMAS_TO': [ prefs['NEPATENKINAMAS_TO'], [ Validators.required, Validators.min( 0 ), Validators.max( 100 ) ] ],
      'PATENKINAMAS_TO': [ prefs['PATENKINAMAS_TO'], [ Validators.required, Validators.min( 0 ), Validators.max( 100 ) ] ],
      'PAGRINDINIS_TO': [ prefs['PAGRINDINIS_TO'], [ Validators.required, Validators.min( 0 ), Validators.max( 100 ) ] ],
    }, {
      validator: this.levelBoundsValidator
    });

    this.isLoading = false;
  }

  private levelBoundsValidator: ValidatorFn = ( control: FormGroup ): ValidationErrors | null => {
    if ( control.get( 'NEPATENKINAMAS_TO' ).value >= control.get( 'PATENKINAMAS_TO' ).value ) {
      return { 'levelBoundsOverlap': true }
    }
    if ( control.get( 'PATENKINAMAS_TO' ).value >= control.get( 'PAGRINDINIS_TO' ).value ) {
      return { 'levelBoundsOverlap': true }
    }
  
    return null;
  };

  saveLevelPrefs() {
    if ( this.form.invalid ) return;

    let prefs : PreferenceModel[] = [];
    prefs.push( { name: 'NEPATENKINAMAS_TO', value: this.form.get( 'NEPATENKINAMAS_TO' ).value } );
    prefs.push( { name: 'PATENKINAMAS_TO', value: this.form.get( 'PATENKINAMAS_TO' ).value } );
    prefs.push( { name: 'PAGRINDINIS_TO', value: this.form.get( 'PAGRINDINIS_TO' ).value } );

    let toast = this.toastService.pushAjaxLoadingNotification();
    this.isLoading = true;

    this.prefService.setPreference( prefs ).pipe(
      catchError( () => {
        throw "Nepavyko išsaugoti nustatymų. Bandykite dar kartą"
      } ),

      switchMap( () => {
        return this.prefService.listPreferences()
      } ),

      catchError( () => { throw "Nepavyko gauti naujų nustatymų. Perkraukite puslapį ir įsitikinkite, kad jūsų pakeitimai buvo išsaugoti" } )
    ).subscribe(
      res => { 
        toast.message = "Nustatymai sėkmingai išsaugoti"
        toast.timeout = 5000
        toast.title = ""
        toast.type = NotificationType.SUCCESS
        this.toastService.updateNotification( toast )
        this.prefState.setState( res );
      },
      err => {
        toast.message = err
        toast.timeout = 12000
        toast.title = "Klaida"
        toast.type = NotificationType.ERROR
        this.toastService.updateNotification( toast )
      },
      () => this.isLoading = false
    )
  }

  ngOnInit() {
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PreferenceModel } from '../models/preference.model';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(
    private http : HttpClient
  ) { }

  listPreferences() : Observable<PreferenceModel[]> {
    return this.http.get<PreferenceModel[]>( `${environment.apiUrl}/api/preferences/list/` );
  }

  setPreference( prefs : PreferenceModel[] ) : Observable<PreferenceModel[]> {
    return this.http.post<PreferenceModel[]>(
        `${environment.apiUrl}/api/preferences/set/`,
        {
            preferences: prefs
        }
    )
  }

  getPreference( name : string ) : Observable<PreferenceModel> {
    return this.http.get<PreferenceModel>( `${environment.apiUrl}/api/preferences/get/${name}/` );
  }

}

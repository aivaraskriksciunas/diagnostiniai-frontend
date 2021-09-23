import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrimesterModel, SchoolYearModel } from '../models/trimester.model';

export interface IAddSchoolYear {
  start_date: string,
  end_date: string
}

export interface IAddTrimester {
  start_date: string,
  end_date: string,
  school_year: number
}

export interface ITrimesterData {
  start_date: string,
  end_date: string,
  school_year: number,
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class TrimesterService {


  constructor( private http : HttpClient ) { }
 
  public getTrimester( trimester_id : number | string ) : Observable<ITrimesterData> {
    return this.http.get<ITrimesterData>( `${environment.apiUrl}/api/trimesters/get/${trimester_id}/` );
  }

  public getTrimesters() : Observable<SchoolYearModel[]> {
    return this.http.get<SchoolYearModel[]>( `${environment.apiUrl}/api/years/list/` );
  }

  public addTrimester( trimester : IAddTrimester, migrate_groups : boolean ) : Observable<TrimesterModel> {
    return this.http.post<TrimesterModel>( `${environment.apiUrl}/api/trimesters/create/?migrate_groups=${+migrate_groups}`, trimester );
  }

  public addSchoolYear( schoolYear : IAddSchoolYear, migrate_classes : boolean ) : Observable<SchoolYearModel> {
    return this.http.post<SchoolYearModel>( `${environment.apiUrl}/api/years/create/?migrate_classes=${+migrate_classes}`, schoolYear );
  }
}

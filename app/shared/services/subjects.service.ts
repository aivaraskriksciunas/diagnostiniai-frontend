import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SubjectModel } from '../models/subject.model';

export interface ISubjectEdit {
  name: string,
  //slug?: string,
  id?: number
}

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor(
    private http: HttpClient
  ) { }

  getSubjectList() : Observable<SubjectModel[]> {
    return this.http.get<SubjectModel[]>( `${environment.apiUrl}/api/subjects/list/` );
  }

  saveSubject( subject : ISubjectEdit ) : Observable<SubjectModel> {
    if ( subject.id == null ) {
      return this.createSubject( subject );
    }

    return this.updateSubject( subject );
  }

  createSubject( subject : ISubjectEdit ) : Observable<SubjectModel> {
    return this.http.post<SubjectModel>( `${environment.apiUrl}/api/subjects/create/`, subject );
  }

  updateSubject( subject : ISubjectEdit ) : Observable<SubjectModel> {
    return this.http.patch<SubjectModel>( `${environment.apiUrl}/api/subjects/update/${subject.id}/`, subject );
  }

  getSubject( id : string | number ) : Observable<SubjectModel> {
    return this.http.get<SubjectModel>( `${environment.apiUrl}/api/subjects/get/${id}/` );
  }

}

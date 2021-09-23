import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentModel } from '../models/student.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface IStudentEdit {
  id?: number,
  first_name: string,
  last_name: string
}

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(
    private http : HttpClient
  ) { }

  public createStudent( student : IStudentEdit ) {
    return this.http.post<StudentModel>( `${environment.apiUrl}/api/students/`, student );
  }

  public getStudent( id : number | string ) : Observable<StudentModel> {
    return this.http.get<StudentModel>( `${environment.apiUrl}/api/students/detail/${id}/` );
  }

  public updateStudent( id: number | string, student : IStudentEdit ) : Observable<StudentModel> {
    return this.http.patch<StudentModel>( `${environment.apiUrl}/api/students/update/${id}/`, student );
  }
}

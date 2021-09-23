import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GradeGroupModel, GradeGroupDetail } from '../models/grade-group.model';
import { map } from 'rxjs/operators';

export interface IGradeGroupEdit {
  grade: number,
  letter: string,
  head_teacher: number,
  school_year: number,
  id?: number,
}

export interface IAddStudents {
  students_list: number[],
  move_students?: boolean
}

export interface IStudentClassAddResult {
  id: number,
  success: boolean,
  message: string
}

export interface IGradeGroupFilter {
  year_id?: number,
  grade?: number,
  all?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(
    private http: HttpClient
  ) { }

  getClassesList( filter? : IGradeGroupFilter ) : Observable<GradeGroupModel[]> {
    let url = `${environment.apiUrl}/api/classes/list/`;
    let params : HttpParams = new HttpParams();
    
    if ( filter.year_id != null && filter.year_id != 0 ) {
      params = params.set( 'year', filter.year_id.toString() );
    }
    if ( filter.grade != null && filter.grade != 0 ) {
      params = params.set( 'grade', filter.grade.toString() );
    }
    if ( filter.all != null ) {
      params = params.set( 'all', filter.all.toString() );
    }

    return this.http.get<GradeGroupModel[]>( url, {
      params: params
    } ).pipe(
      map( list => list.sort(
        ( a, b ) => {
          if ( a.grade == b.grade ) {
            if ( a.letter < b.letter ) {
              return -1;
            }
            else if ( a.letter > b.letter ) {
              return 1;
            }
          }
          else if ( a.grade < b.grade ) {
            return -1;
          }
          else if ( a.grade > b.grade ) {
            return 1;
          }

          return 0;
        }
      ) )
    );
  }

  saveClass( gradeGroup : IGradeGroupEdit ) : Observable<GradeGroupModel> {
    if ( gradeGroup.id == null ) 
      return this.createClass( gradeGroup );

    return this.updateClass( gradeGroup );
  }

  createClass( gradeGroup : IGradeGroupEdit ) : Observable<GradeGroupModel> {
    return this.http.post<GradeGroupModel>( `${environment.apiUrl}/api/classes/`, gradeGroup );
  }

  updateClass( gradeGroup : IGradeGroupEdit ) : Observable<GradeGroupModel> {
    return this.http.patch<GradeGroupModel>( `${environment.apiUrl}/api/classes/update/${gradeGroup.id}/`, gradeGroup );
  }

  getClassDetail( id : number | string ) : Observable<GradeGroupDetail> {
    return this.http.get<GradeGroupDetail>( `${environment.apiUrl}/api/classes/detail/${id}/` );
  }

  addStudents( class_id : number, students : IAddStudents ) : Observable<IStudentClassAddResult[]> {
    return this.http.post<IStudentClassAddResult[]>( `${environment.apiUrl}/api/classes/${class_id}/add_students/`, students );
  }

  removeStudents( id: number | string, students_list: number[] ) : Observable<IStudentClassAddResult[]> {
    return this.http.post<IStudentClassAddResult[]>( `${environment.apiUrl}/api/classes/${id}/remove_students/`, {
      students_list: students_list
    } );
  }
}

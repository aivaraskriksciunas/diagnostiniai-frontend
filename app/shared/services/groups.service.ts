import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IEditCourseGroup, CourseGroupModel, CourseGroupDetailModel } from '../models/course-group.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IStudentAddResult {
  id: number,
  success: boolean,
  message: string
}

export interface IGroupFilter {
  trimester_id?: number | string,
  subject?: number | string,
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(
    private http : HttpClient
  ) { }

  saveGroup( courseGroup : IEditCourseGroup ) : Observable<CourseGroupModel> {
    if ( courseGroup.id != null ) {
      return this.updateGroup( courseGroup );
    }

    return this.createGroup( courseGroup );
  }

  createGroup( courseGroup : IEditCourseGroup ) : Observable<CourseGroupModel> {
    return this.http.post<CourseGroupModel>( `${environment.apiUrl}/api/groups/`, courseGroup );
  }

  updateGroup( courseGroup : IEditCourseGroup ) : Observable<CourseGroupModel> {
    return this.http.patch<CourseGroupModel>( `${environment.apiUrl}/api/groups/${courseGroup.id}/`, courseGroup );
  }

  deleteGroup( group : number ) : Observable<any> {
    return this.http.delete( `${environment.apiUrl}/api/groups/delete/${group}/` );
  }

  getGroupDetail( id : number | string ) : Observable<CourseGroupDetailModel> {
    return this.http.get<CourseGroupDetailModel>( `${environment.apiUrl}/api/groups/detail/${id}/` );
  }

  addStudents( id: number | string, students_list : number[] ) : Observable<IStudentAddResult> {
    return this.http.post<IStudentAddResult>( `${environment.apiUrl}/api/groups/${id}/add_students/`, {
      students_list: students_list
    } );
  }

  removeStudents( id: number | string, students_list: number[] ) : Observable<IStudentAddResult> {
    return this.http.post<IStudentAddResult>( `${environment.apiUrl}/api/groups/${id}/remove_students/`, {
      students_list: students_list
    } );
  }

  listGroups( filter : IGroupFilter ) : Observable<CourseGroupModel[]> {
    let url = `${environment.apiUrl}/api/groups/list/`;
    let params : HttpParams = new HttpParams();

    if ( filter.trimester_id != null ) {
      params = params.set( 'trimester_id', filter.trimester_id.toString() );
    }
    if ( filter.subject != null ) {
      params = params.set( 'subject', filter.subject.toString() );
    }

    return this.http.get<CourseGroupModel[]>( url, {
      params: params
    } );
  }
}

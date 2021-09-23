import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor( private http: HttpClient ) { }

  getStudentReport( student_id: number, subjects: number[] ) : Observable<Object[]> {
    return this.http.post<Object[]>( `${environment.apiUrl}/api/reporting/student/${student_id}/`, {
      subjects: subjects
    } );
  } 

  downloadStudentReport( student_id: number, subjects: number[] ) : Observable<Blob> {
    return this.http.post<Blob>( `${environment.apiUrl}/api/documents/download_student_report/${student_id}/`, {
      subjects: subjects
    }, { 
      // @ts-ignore Suppress error showing bad type. TS picks the wrong function overload, where responseType is set to a different value
      responseType: "blob", 
    }).pipe(
      tap( r => {
        const url = window.URL.createObjectURL( r )
        window.open( url )
      } )
    )
  }

  getStudentGroupReport( students: number[], exams: number[] ) : Observable<Object[]> {
    return this.http.post<Object[]>( `${environment.apiUrl}/api/reporting/student_group/`, {
      students: students,
      exams: exams
    })
  }

  downloadStudentGroupReport( students: number[], exams: number[] ) : Observable<Blob> {
    return this.http.post<Blob>( `${environment.apiUrl}/api/documents/download_student_group_report/`, {
      students: students,
      exams: exams
    }, { 
      // @ts-ignore Suppress error showing bad type. TS picks the wrong function overload, where responseType is set to a different value
      responseType: "blob", 
    }).pipe(
      tap( r => {
        const url = window.URL.createObjectURL( r )
        window.open( url )
      } )
    )
  }

  downloadYearlyReport( subject : number, grade : number, semesters : number[], only_finals : boolean ) : Observable<Blob> {
    return this.http.post<Blob>( `${environment.apiUrl}/api/documents/download_yearly_report/?finals_only=${only_finals}`, {
      subject: subject,
      grade: grade,
      trimesters: semesters,
    }, { 
      // @ts-ignore Suppress error showing bad type. TS picks the wrong function overload, where responseType is set to a different value
      responseType: "blob", 
    }).pipe(
      tap( r => {
        const url = window.URL.createObjectURL( r )
        window.open( url )
      } )
    )
  }

  getYearlyReport( subject : number, grade : number, semesters : number[], only_finals : boolean ) : Observable<Object[]> {
    return this.http.post<Object[]>( `${environment.apiUrl}/api/reporting/yearly/?finals_only=${only_finals}`, {
      subject: subject,
      grade: grade,
      trimesters: semesters,
    } )
  }

  getLevelReport( students : number[], exams: number[], trimester: number, level: string ) : Observable<any[]> {
    return this.http.post<any[]>( `${environment.apiUrl}/api/reporting/levels/`, {
      students: students,
      exams: exams,
      trimester: trimester,
      level: level
    } )
  }

  downloadLevelReport( students : number[], exams: number[], trimester: number, level: string ) : Observable<Blob> {
    return this.http.post<Blob>( `${environment.apiUrl}/api/documents/download_level_report/`, {
      students: students,
      exams: exams,
      trimester: trimester,
      level: level
    }, { 
      // @ts-ignore Suppress error showing bad type. TS picks the wrong function overload, where responseType is set to a different value
      responseType: "blob", 
    }).pipe(
      tap( r => {
        const url = window.URL.createObjectURL( r )
        window.open( url )
      } )
    )
  }
}

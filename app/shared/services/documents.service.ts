import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface StudentUploadResults {
    students: [{
        id: number,
        first_name: string,
        last_name: string,
        grade_group: string,
        row: number,
    }]
    errors: [{
        message: string,
        first_name: string,
        last_name: string,
        row: number,
        grade_group: string,
    }]
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(
    private http: HttpClient
  ) { }

  uploadStudents( file: File, has_headers: boolean, year_id: number ) : Observable<StudentUploadResults> {
    var formData = new FormData();
    formData.append( 'file', file, 'list.xlsx' );
    formData.append( 'has_header', has_headers ? 'true' : 'false' );
    formData.append( 'school_year', year_id.toString() );
    return this.http.post<StudentUploadResults>( `${environment.apiUrl}/api/documents/upload_students/`, formData );
  }

}

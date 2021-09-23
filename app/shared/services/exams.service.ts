import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { ExamModel, ExamDetailModel } from '../models/exam.model';
import { environment } from "src/environments/environment";
import { PaginatedList } from "../models/paginated_list.model";

export interface IEditExam {
    id?: number,
    name: string,
    max_score: number,
    min_score: number,
    group: number,
    taken_at: string,
    owner: number,
    is_diagnostinis: boolean,
}

export interface IExamFilter {
    group_ids?: number[] | string[],
    trimester_id?: number | string,
    owner_id?: number | string,
    subject?: string
}

export interface IEditGrade {
    value: number | string,
    student: number | string
}

export interface EditGradeStatus {
    success: boolean,
    student: number,
    message: string
}

export interface IStudentExamsGrouped {
    trimester_id: number,
    human_name: string,
    exams: ExamModel[]
}

@Injectable({ providedIn: 'root'})
export class ExamsService {

    constructor(
        private http : HttpClient
    ) {}

    saveExam( exam : IEditExam ) : Observable<ExamModel> {
        if ( exam.id == null ) {
            return this.createExam( exam );
        }

        return this.updateExam( exam );
    }

    createExam( exam : IEditExam ) : Observable<ExamModel> {
        return this.http.post<ExamModel>( `${environment.apiUrl}/api/exams/create/`, exam );
    }

    updateExam( exam: IEditExam ) : Observable<ExamModel> {
        return this.http.patch<ExamModel>(`${environment.apiUrl}/api/exams/update/${exam.id}/`, exam );
    }

    getExam( id: number | string ) : Observable<ExamModel> {
        return this.http.get<ExamModel>( `${environment.apiUrl}/api/exams/get/${id}/` );
    }

    listExams( filter : IExamFilter, page?: number, results_per_page?: number ) : Observable<PaginatedList<ExamModel>> {
        let url = `${environment.apiUrl}/api/exams/list/`;
        let params : HttpParams = new HttpParams();
        
        if ( page != null ) {
            params = params.set( 'page', page.toString() );
        }
        if ( results_per_page != null ) {
            params = params.set( 'page_size', results_per_page.toString() );
        }

        return this.http.post<PaginatedList<ExamModel>>( url, filter, { params: params } );
    }

    getExamDetail( id: number | string ) : Observable<ExamDetailModel> {
        return this.http.get<ExamDetailModel>(`${environment.apiUrl}/api/exams/detail/${id}/` );
    }


    setGrade( exam_id: number | string, grades : IEditGrade[] ) : Observable<EditGradeStatus[]> {
        return this.http.post<EditGradeStatus[]>( 
            `${environment.apiUrl}/api/exams/set_grade/${exam_id}/`, 
            { grades: grades }
        );
    }

    deleteExam( exam_id : number ) : Observable<any> {
        return this.http.delete( `${ environment.apiUrl }/api/exams/delete/${exam_id}/` );
    }

    getStudentsExams( students: number[], subject_id: number, trimester?: number ) : Observable<IStudentExamsGrouped[]> {
        return this.http.post<IStudentExamsGrouped[]>( `${environment.apiUrl}/api/exams/students/`, {
            students: students,
            subject: subject_id,
            trimester: trimester || null
        } );
    }

}
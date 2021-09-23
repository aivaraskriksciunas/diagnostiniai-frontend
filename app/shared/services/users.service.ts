import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedList } from '../models/paginated_list.model';

export interface IUserResult {
  id: number,
  username: string,
  role: string,
  name: string,
}

export interface ISaveUser {
  id?: number,
  name: string,
  username: string,
  role: string,
  password?: string,
}

export interface IValidateUsername {
  taken: boolean,
  suggested_name?: string
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor( private http: HttpClient ) { }

  getUserList( page?: number, results_per_page?: number ) : Observable<PaginatedList<IUserResult>> {
    let params : HttpParams = new HttpParams();
    
    if ( page != null ) {
      params = params.set( 'page', page.toString() );
    }
    if ( results_per_page != null ) {
        params = params.set( 'page_size', results_per_page.toString() );
    }

    return this.http.get<PaginatedList<IUserResult>>( `${environment.apiUrl}/api/users/list/`, {
      params: params
    } );
  }

  getFullUserList() : Observable<IUserResult[]> {
    return this.http.get<IUserResult[]>( `${environment.apiUrl}/api/users/list_all/` );
  }

  saveUser( user : ISaveUser ) : Observable<IUserResult> {
    if ( user.id == undefined ) {
      return this.createUser( user );
    }

    return this.updateUser( user );
  }

  createUser( user : ISaveUser ) : Observable<IUserResult> {
    return this.http.post<IUserResult>( `${environment.apiUrl}/api/users/create/`, user );
  }

  updateUser( user : ISaveUser ) : Observable<IUserResult> {
    return this.http.patch<IUserResult>( `${environment.apiUrl}/api/users/${user.id}/`, user );
  }

  validateUsername( username: string, exclude?: number ) : Observable<IValidateUsername> {
    let url = `${environment.apiUrl}/api/users/validate-username/${username}/`;
    if ( exclude != null ) {
      url += `?exclude=${exclude}`
    }
    return this.http.get<IValidateUsername>( url );
  }

  getUser( id : number | string ) : Observable<IUserResult> {
    return this.http.get<IUserResult>( `${environment.apiUrl}/api/users/${id}/` );
  }

  deleteUser( id: number | string ) : Observable<any> {
    return this.http.delete<any>( `${environment.apiUrl}/api/users/delete/${id}/` );
  }
}

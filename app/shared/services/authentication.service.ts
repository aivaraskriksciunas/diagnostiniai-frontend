import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon'

export enum UserRoles {
    ADMINISTRATOR = "ADMIN",
    TEACHER = "TEACHER"
}

export interface UserModel {
    username: string,
    name: string,
    role: string,
    id: number,
}

interface ITokenPayload {
    exp: number,
    user: UserModel
}

interface Token {
    token: string,
    payload: ITokenPayload
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    
    private token: Token;

    constructor( 
        private http: HttpClient ) {
        
    }

    public get authenticatedUser(): UserModel {
        return this.token.payload.user || null;
    }

    public get tokenObject(): Token {
        return this.token || null;
    }

    public isAuthenticated() : boolean {
        return this.token != null;
    }

    login( username: string, password: string ) {
        return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { 
            username: username, 
            password: password }
        )
        .pipe(
            map( user => {
                this.token = this.parseToken( user.token )
                localStorage.setItem( 'token', JSON.stringify( this.token ) )
            }
        ) );
    }

    loginFromStorage() : boolean {
        let tokenObj: Token = JSON.parse( localStorage.getItem( 'token' ) );
        if ( tokenObj == null ) return false;

        // Check if token is not expired
        let expireDate = DateTime.fromSeconds( tokenObj.payload.exp );
        if ( DateTime.local() > expireDate.plus({ minutes: 2 } )) {
            this.logout();
            return false;
        }

        this.token = tokenObj;
        return true;
    }

    refreshToken()  {
        let currentToken : Token = JSON.parse( localStorage.getItem( 'token' ) );

        return this.http.post<any>(`${environment.apiUrl}/api/auth/refresh`, { 
            token: currentToken.token
        })
        .pipe(
            map( user => {
                this.token = this.parseToken( user.token )
                localStorage.setItem( 'token', JSON.stringify( this.token ) )
            }
        ) );
    }

    /*
    *  Retrieves a user object from the JWT token,
    *  or null if token does not exist
    */
    parseToken( token: string ) {
        let tokenParts = token.split( '.' );
        // Decode the payload
        let payload = tokenParts[1];
        // Decode base64 string
        payload = atob( payload );
        let obj = JSON.parse( payload );
        let tokenObj: Token = {
            token: token,
            payload: {
                exp: obj.exp,
                user: {
                    id: obj.user.id,
                    username: obj.user.username,
                    role: obj.user.role,
                    name: obj.user.name,
                }
            }
        };
        return tokenObj
    }


    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem( 'token' );
        this.token = null;
    }
}
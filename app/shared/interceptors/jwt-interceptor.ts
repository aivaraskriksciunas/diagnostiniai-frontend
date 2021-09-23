import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor ( private authService: AuthenticationService ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> 
    {
        let request = req;
        // Set authorization header
        if ( this.authService.isAuthenticated() ) {
            request = req.clone({
                setHeaders: {
                    Authorization: this.authService.tokenObject.token
                }
            })
        }
        return next.handle( request );
    }
}
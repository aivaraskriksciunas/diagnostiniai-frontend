import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean 
  {
    if ( this.authService.isAuthenticated() || this.authService.loginFromStorage() ) {
      return true;
    }

    this.router.navigate([ 'auth', 'login' ], { queryParams: { r: state.url.toString() } });
    return false;
  }
}

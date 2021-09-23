import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form : FormGroup;
  public error : string;
  public isLoading : boolean = false;

  constructor( 
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder : FormBuilder ) { }

  ngOnInit() {
    if ( this.authService.loginFromStorage() ) {
      this.navigate()
    }

    this.form = this.formBuilder.group({
      'username': [ '', [ Validators.required,  ] ],
      'password': [ '', [ Validators.required ] ]
    });
  }

  login() {
    this.error = "";
    this.isLoading = true;

    if ( this.form.invalid ) return;

    this.authService.login( 
        this.form.get( 'username' ).value, 
        this.form.get( 'password' ).value )
    .subscribe(
      _ => {
        this.navigate();
      },
      error => {
        if ( error.error.message != null ) {
          this.error = error.error.message;
          this.isLoading = false;
          return;
        }

        this.error = "Prisijungimo klaida. Patikrinkite įvestus duomenis ir bandykite dar karta"
        this.isLoading = false;
      },
    );
  }

  private navigate() {
    this.activatedRoute.params.subscribe( params => {
      // Check if a redirect parameter was passed
      if ( params.r === undefined ) {
        this.router.navigate([ '/' ]);
        return;
      }

      this.router.navigateByUrl( params.r );

    } )
  }

}

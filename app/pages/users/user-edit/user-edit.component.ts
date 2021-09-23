import { Component, OnInit, Input, Output, ViewChild, SimpleChanges } from '@angular/core';
import { IUserResult, ISaveUser, UsersService } from '../../../shared/services/users.service';
import { DateTime } from 'luxon';
import { EventEmitter } from '@angular/core';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @Input( 'user' ) user : ISaveUser = null;

  @Output() userSaved = new EventEmitter();
  @Output() userCanceled = new EventEmitter();

  @ViewChild( 'confirmDeleteModal', {static: false} ) modal : ModalComponent;

  private shouldSuggestUsername : boolean = true;
  public passwordType : string = 'password';

  // Username validation variables
  public usernameValidationLoading : boolean = false;
  public isUsernameTaken : boolean = false;
  public suggestedUsername : string = '';

  public form : FormGroup;

  constructor( 
    private usersService : UsersService,
    private toastService : ToastNotificationService,
    private fb : FormBuilder
  ) { }

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    this.resetForm();
  }

  private resetForm() {
    this.passwordType = 'password';
    this.shouldSuggestUsername = true;
    
    if ( this.user == null ) {
      this.form = this.fb.group({
        'id': [ null ],
        'name': [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
        'username': [ '', [ Validators.required, Validators.minLength( 5 ) ] ],
        'password': [ '', Validators.required ],
        'role': [ 'TEACHER', [ Validators.required ] ]
      })
    }
    else {
      this.form = this.fb.group({
        'id': [ this.user.id ],
        'name': [ this.user.name, [ Validators.required, Validators.minLength( 5 ) ] ],
        'username': [ this.user.username, [ Validators.required, Validators.minLength( 5 ) ] ],
        'password': [ '' ],
        'role': [ this.user.role, [ Validators.required ] ]
      })
    }
  }

  public onUserSave() {
    if ( this.form.valid == false ) return;

    let toast = this.toastService.pushAjaxLoadingNotification();

    let userModel : ISaveUser = {
      username: this._username.value,
      name: this._name.value,
      password: this._password.value != '' ? this._password.value : null,
      role: this._role.value,
      id: this._id.value
    }

    this.usersService.saveUser( userModel ).subscribe(
      _ => {
        toast.title = "Vartotojas užsaugotas";
        toast.message = "";
        toast.timeout = 6000;
        toast.type = NotificationType.SUCCESS;
        this.toastService.updateNotification( toast );

        this.userSaved.emit();
        this.resetForm();

      },
      _ => {
        toast.title = "Klaida";
        toast.message = "Nepavyko išsaugoti vartotojo. Bandykite dar kartą";
        toast.timeout = 6000;
        toast.type = NotificationType.ERROR;
        this.toastService.updateNotification( toast );
      }
    )
  }

  public suggestUsername() {
    if ( !this.shouldSuggestUsername || this._id.value != null ) return;

    let username = this._name.value.toLowerCase().replace( /\s/, '' );
    if ( username.length < 5 ) return;

    this._username.setValue( username + DateTime.local().year );
    this.validateUsername();
  }

  public validateUsername() {
    if ( this._username.value.length < 5 ) return;
    this.usernameValidationLoading = true;

    this.usersService.validateUsername( this._username.value, this._id.value )
    .subscribe( 
      response => {
        this.isUsernameTaken = response.taken;
        this.suggestedUsername = '';
        if ( response.suggested_name != undefined ) {
          this.suggestedUsername = response.suggested_name;
        }
      },
      error => {
        this.isUsernameTaken = true;
      },
      () => {
        // remove loading message
        this.usernameValidationLoading = false;
      }
    )
  }

  public disableUsernameSuggest() {
    this.shouldSuggestUsername = false;
  }

  public showPassword() {
    this.passwordType = 'text';
  }

  public hidePassword() {
    this.passwordType = 'password';
  }

  public userCancel() {
    this.userCanceled.emit();
    this.resetForm();
  }

  public setUsername( username : string ) {
    this._username.setValue( username );
    this.validateUsername();
  }

  public askDeleteUser() {
    this.modal.open();
  }

  public deleteUser() {
    this.modal.close();
    let toast = this.toastService.pushAjaxLoadingNotification();
    this.usersService.deleteUser( this._id.value ).subscribe(
      _ => {
        toast.title = "Vartotojas ištrintas";
        toast.message = ""
        toast.timeout = 7000
        toast.type = NotificationType.SUCCESS;
        this.toastService.updateNotification( toast );
        this.userSaved.emit();
      },
      _ => {
        toast.title = "Klaida";
        toast.message = "Nepavyko ištrinti vartotojo. Bandykite dar kartą"
        toast.timeout = 10000;
        toast.type = NotificationType.ERROR;
        this.toastService.updateNotification( toast )
      }
    )
  }

  public get _username() {
    return this.form.get( 'username' );
  }

  public get _name() {
    return this.form.get( 'name' );
  }

  public get _role() {
    return this.form.get( 'role' );
  }

  public get _id() {
    return this.form.get( 'id' );
  }

  public get _password() {
    return this.form.get( 'password' );
  }

}

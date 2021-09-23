import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectModel } from 'src/app/shared/models/subject.model';
import { SubjectsState } from 'src/app/shared/states/subjects.state';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { GroupsService } from '../../../shared/services/groups.service';
import { IEditCourseGroup } from '../../../shared/models/course-group.model';
import { UserModel } from 'src/app/shared/services/authentication.service';
import { UsersService } from '../../../shared/services/users.service';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss', '../../shared/styles/pages.styles.scss']
})
export class EditGroupComponent implements OnInit {

  @Input( 'group' ) public group : IEditCourseGroup;
  @ViewChild( 'confirmDeleteModal', {static: false} ) modal : ModalComponent;

  public form : FormGroup;
  public subjects : SubjectModel[];
  public trimesterId : number;
  public users : UserModel[];

  public isAdmin : boolean = false;

  public isTrimesterSelected : boolean = true;

  constructor(
    private formBuilder : FormBuilder,
    private subjectsState : SubjectsState,
    private trimesterState : CurrentTrimesterState,
    private groupService : GroupsService,
    private userService : UsersService,
    private toastService : ToastNotificationService,
    private route : ActivatedRoute,
    private authService : AuthenticationService,
    private router : Router
  ) { 
    
    // Get all subjects from the state instead of ajax
    this.subjectsState.getState().subscribe( 
      subjects => this.subjects = subjects
    );
    
    this.isAdmin = this.authService.authenticatedUser.role == 'ADMIN';

    if ( this.isAdmin ) { 
      this.userService.getFullUserList().subscribe(
        list => this.users = list,
        _ => this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti vartotojų sąrašo", 10000 )
      );
    }
  }

  ngOnInit() {
    // Check if we will be creating group
    if ( this.group == null || this.group.id == null ) {
      this.isTrimesterSelected = false;
      
      let subjectId = this.route.snapshot.queryParamMap.get( 'subject' );

      this.group = {
        name: '',
        subject: subjectId != null ? subjectId : '',
        head_teacher: this.isAdmin ? 0 : this.authService.authenticatedUser.id,
        trimester: 0,
      }

      // Setup form for group creation
      this.trimesterState.getState().subscribe(
        state => {
          this.isTrimesterSelected = state.isSelected;
          if ( state.isSelected == false ) return;

          this.group.trimester = state.trimester.id;
        }
      );
    }

    this.form = this.formBuilder.group({
      'subject': [ this.group.subject, [ Validators.required ] ],
      'name': [ this.group.name, [ Validators.required, Validators.maxLength( 10 ) ] ],
      'head_teacher': [ this.group.head_teacher, [ Validators.required ] ],
      'should_open_group': true
    });
    
  }

  public saveGroup() {
    let group : IEditCourseGroup = {
      name: this.form.get( 'name' ).value,
      subject: this.form.get( 'subject' ).value,
      trimester: this.group.trimester,
      id: this.group.id,
      head_teacher: this.form.get( 'head_teacher' ).value
    }

    let toast = this.toastService.pushAjaxLoadingNotification();
    this.groupService.saveGroup( group ).subscribe(
      res => {
        toast.title = "";
        toast.message = `Grupė ${res.name} sėkmingai užsaugota`; 
        toast.type = NotificationType.SUCCESS;
        toast.timeout = 5000;
        this.toastService.updateNotification( toast );
        
        // Open the created group
        if ( this.group.id == null && this.form.get( 'should_open_group' ).value ) {
          this.router.navigate([ '/group', 'view', res.id ]);
        }
      },
      _ => {
        toast.title = "Klaida!";
        toast.message = `Grupė nebuvo sukurta. Patikrinkite įvestus duomenis ir bandykite dar kartą`; 
        toast.type = NotificationType.ERROR;
        toast.timeout = 10000;
        this.toastService.updateNotification( toast );
      }
    )
  }

  public deleteGroup() {
    let toast = this.toastService.pushAjaxLoadingNotification();
    this.modal.close();

    this.groupService.deleteGroup( this.group.id ).subscribe(
      () => {
        toast.title = "";
        toast.message = `Grupė ištrinta`; 
        toast.type = NotificationType.SUCCESS;
        toast.timeout = 5000;
        this.toastService.updateNotification( toast );
        this.router.navigate([ '/subject/view/', this.group.subject ]);
      },
      () => {
        toast.title = "Klaida";
        toast.message = `Nepavyko ištrinti grupės`; 
        toast.type = NotificationType.ERROR;
        toast.timeout = 10000;
        this.toastService.updateNotification( toast );
      }

    )
  }

}

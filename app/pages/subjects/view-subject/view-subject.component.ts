import { Component, OnInit } from '@angular/core';
import { CourseGroupModel } from 'src/app/shared/models/course-group.model';
import { GroupsService } from '../../../shared/services/groups.service';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { AuthenticationService, UserModel } from '../../../shared/services/authentication.service';
import { SubjectModel } from 'src/app/shared/models/subject.model';
import { SubjectsService } from 'src/app/shared/services/subjects.service';
import { ISubjectEdit } from '../../../shared/services/subjects.service';

@Component({
  selector: 'app-view-subject',
  templateUrl: './view-subject.component.html',
  styleUrls: ['./view-subject.component.scss', '../../shared/styles/pages.styles.scss']
})
export class ViewSubjectComponent implements OnInit {

  public groups : CourseGroupModel[] = [];
  public user : UserModel = null;

  public isSubjectLoading : boolean = true;
  public isGroupsLoading : boolean = true;
  public subjectEdit : ISubjectEdit;

  public isAdmin : boolean = false;

  constructor(
    private currentTrimesterState : CurrentTrimesterState,
    private authService : AuthenticationService,
    private groupsService : GroupsService,
    private subjectService : SubjectsService,
    private toastService : ToastNotificationService,
    private route : ActivatedRoute
  ) { 

    // Subscribe to path changes
    this.route.paramMap.subscribe(
      map => {
        let id = map.get( 'id' );
        if ( id == '' || id == null ) return;

        // Retrieve subject info
        this.isSubjectLoading = true;
        this.subjectService.getSubject( id ).subscribe(
          res => {
            this.subjectEdit = res;
            this.isSubjectLoading = false;
          }
        );

        let trimester = this.currentTrimesterState.getCurrentState();
        // Retrieve groups
        if ( trimester.isSelected )
          this.refreshGroups( trimester.trimester.id, id )
      }
    )

    // Subscribe to trimester change
    this.currentTrimesterState.getState().subscribe(
      trimester => { 
        if ( !trimester.isSelected ) return; 
        this.refreshGroups( trimester.trimester.id, route.snapshot.paramMap.get( 'id' ) ) 
      }
    );

    this.user = this.authService.authenticatedUser;
  
    this.isAdmin = this.authService.authenticatedUser.role == 'ADMIN';
  }

  ngOnInit() {
  }

  private refreshGroups( trimester : number, subject : string ) {
    this.isGroupsLoading = true;

    this.groupsService.listGroups({ trimester_id: trimester, subject: subject }).subscribe(
      res => {
        this.groups = res;
        this.isGroupsLoading = false;
      },
      _ => this.toastService.pushErrorNotification( "Klaida!", "Nepavyko gauti grupių iš serverio!", 8000 )
    );
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService, IGradeGroupEdit } from 'src/app/shared/services/classes.service';
import { GradeGroupDetail, GradeGroupStudent } from '../../../shared/models/grade-group.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss', '../../shared/styles/pages.styles.scss']
})
export class ViewClassComponent {

  @ViewChild( 'confirmDeleteModal', {static: false} ) private confirmDeleteModal : ModalComponent;

  public group : GradeGroupDetail;
  public groupEdit : IGradeGroupEdit;
  public isLoading : boolean = true;
  public isAdmin : boolean = false;

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private classesService : ClassesService,
    private toastService : ToastNotificationService,
    private authService : AuthenticationService
  ) { 

    this.route.paramMap.subscribe( 
      map => this.getClassInfo( map.get( 'id' ) )
    )

    this.isAdmin = this.authService.authenticatedUser.role == 'ADMIN';
  }

  private getClassInfo( id : number | string ) {
    this.isLoading = true;
    this.classesService.getClassDetail( id ).subscribe(
      group => {
        this.group = group;
        this.groupEdit = {
          id: group.id,
          letter: group.letter,
          grade: group.grade,
          head_teacher: group.head_teacher,
          school_year: group.school_year
        }
        this.isLoading = false;
      }
    )
  }

  private removingStudent : GradeGroupStudent;
  openRemoveDialog( student : GradeGroupStudent ) {
    this.removingStudent = student;
    this.confirmDeleteModal.open();
  }

  removeStudent() {
    this.confirmDeleteModal.close();
    let toast = this.toastService.pushAjaxLoadingNotification();
    this.classesService.removeStudents( this.group.id, [ this.removingStudent.id ] ).subscribe(
      () => {
        toast.title = "";
        toast.message = "Mokinys pašalintas iš klasės";
        toast.timeout = 4000;
        toast.type = NotificationType.SUCCESS;
        this.toastService.updateNotification( toast );
        // Update student list
        this.getClassInfo( this.group.id );
      },
      () => {
        toast.title = "Klaida";
        toast.message = "Nepavyko ištrinti mokinio iš klasės. Bandykite dar kartą";
        toast.timeout = 10000;
        toast.type = NotificationType.ERROR;
        this.toastService.updateNotification( toast );
      },
    )
  }

  editStudent( student : GradeGroupStudent ) {
    this.router.navigate([ '/class/student/', student.id ]);
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GroupsService } from '../../../shared/services/groups.service';
import { ActivatedRoute } from '@angular/router';
import { CourseGroupDetailModel } from 'src/app/shared/models/course-group.model';
import { StudentModel } from 'src/app/shared/models/student.model';
import { IEditCourseGroup } from '../../../shared/models/course-group.model';
import { ExamModel } from 'src/app/shared/models/exam.model';
import { ExamsService } from '../../../shared/services/exams.service';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss', '../../shared/styles/pages.styles.scss']
})
export class ViewGroupComponent implements OnInit {

  public isLoading : boolean = true;
  public students : StudentModel[] = []
  public group : CourseGroupDetailModel = null;
  public exams : ExamModel[] = [];
  public isExamsLoading : boolean = true;

  @ViewChild( 'confirmDeleteModal', {static: false} ) modal : ModalComponent;
  @ViewChild( 'confirmExamDeleteModal', {static: false} ) examModal : ModalComponent;

  constructor(
    private groupService : GroupsService,
    private route : ActivatedRoute,
    private examService : ExamsService,
    private toastService : ToastNotificationService,
  ) { 
    this.isLoading = true;
    this.route.paramMap.subscribe(
      map => {
        this.updateStudentList( map.get( 'id' ) )
        this.getExamList( map.get( 'id' ) )
      }
    )  
  }

  ngOnInit() {
  }

  private getExamList( groupId : string ) {
    this.isExamsLoading = true;

    this.examService.listExams({
      group_ids: [ groupId ]
    }).subscribe(
      list => this.exams = list.results,
      _ => {
        this.toastService.pushErrorNotification( "Klaida", "Nepavyko gauti grupės atsiskaitomųjų darbų. Bandykite paleisti puslapį iš naujo", 10000 );
      }
    );
  }

  private updateStudentList( groupId : string | number ) {
    this.isLoading = true;

    this.groupService.getGroupDetail( groupId ).subscribe(
      group => {
        this.group = group;
        this.students = group.students;
        this.isLoading = false;
      }
    )
  }

  get editGroupModel() : IEditCourseGroup {
    return {
      name: this.group.name,
      head_teacher: this.group.head_teacher,
      subject: this.group.subject.id.toString(),
      trimester: this.group.trimester,
      id: this.group.id
    };
  }

  private removingStudent : StudentModel;
  public askRemoveStudent( id : StudentModel ) {
    this.removingStudent = id;
    this.modal.open();
  }

  public removeStudent() {
    let toast = this.toastService.pushAjaxLoadingNotification();

    this.groupService.removeStudents( this.group.id, [ this.removingStudent.id ] ).subscribe(
      res => {
        toast.message = res[0].message;
        toast.timeout = 6000;

        if ( res[0].success ) {
          toast.type = NotificationType.SUCCESS;
        }
        else {
          toast.type = NotificationType.ERROR;
        }

        this.toastService.updateNotification( toast );
        this.updateStudentList( this.route.snapshot.paramMap.get( 'id' ) );
      }
    )

    this.modal.close();
  }


  
  private removingExam : ExamModel;
  public askDeleteExam( exam : ExamModel ) {
    this.removingExam = exam;
    this.examModal.open();
  }

  public removeExam() {
    let toast = this.toastService.pushAjaxLoadingNotification();

    this.examService.deleteExam( this.removingExam.id ).subscribe(
      res => {
        toast.title = "Testas ištrintas";
        toast.message = "";
        toast.type = NotificationType.SUCCESS;
        toast.timeout = 6000;

        this.toastService.updateNotification( toast );
        this.getExamList( this.route.snapshot.paramMap.get( 'id' ) );
      },
      _ => {
        toast.title = "Klaida";
        toast.message = "Nepavyko ištrinti atsiskaitomojo darbo";
        toast.type = NotificationType.ERROR;
        toast.timeout = 10000;
      }
    )

    this.examModal.close();
  }

}

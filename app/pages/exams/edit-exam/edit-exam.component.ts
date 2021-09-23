import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { GroupsService } from '../../../shared/services/groups.service';
import { CourseGroupModel } from 'src/app/shared/models/course-group.model';
import { ActivatedRoute } from '@angular/router';
import { ExamsService, IEditExam } from '../../../shared/services/exams.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss', '../../shared/styles/pages.styles.scss']
})
export class EditExamComponent implements OnInit {

  @Input() public exam : IEditExam;

  public isTrimesterSelected : boolean  = false;
  public isLoading : boolean = true;
  public groups : CourseGroupModel[] = [];

  public form : FormGroup = null;

  constructor(
    private formBuilder : FormBuilder,
    private currentTrimester : CurrentTrimesterState,
    private groupService : GroupsService,
    private activatedRoute : ActivatedRoute,
    private examService : ExamsService,
    private authService : AuthenticationService,
    private toastService : ToastNotificationService,
    private location : Location
  ) { 
    this.currentTrimester.getState().subscribe(
      data => {
        this.isTrimesterSelected = data.isSelected;
        if ( data.isSelected == false ) {
          return;
        }
        
        // If trimester is selected, get a list of groups from the server
        this.groupService.listGroups({
          trimester_id: data.trimester.id
        }).subscribe(
          res => this.groups = res
        );
      }
    );

    this.activatedRoute.paramMap.subscribe(
      params => {
        if ( !params.has( 'id' ) ) {
          // Ready to create a new exam
          this.exam = {
            name: '',
            max_score: 100,
            min_score: 0,
            group: +this.activatedRoute.snapshot.queryParamMap.get( 'group_id' ) || 0,
            owner: this.authService.authenticatedUser.id,
            taken_at: '',
            is_diagnostinis: true,
          };
          this.isLoading = false;
          this.createForm( this.exam );
        }
        else {
          // Retrieve exam from the server
          this.examService.getExam( params.get( 'id' ) ).subscribe(
            exam => {
              this.exam = exam;
              this.isLoading = false;
              this.createForm( this.exam );
            }
          )
        }
      }
    )
  }

  ngOnInit() {
  }

  private createForm( exam : IEditExam ) {
    this.form = this.formBuilder.group({
      'name': [ exam.name, [ Validators.required ] ],
      'max_score': [ exam.max_score, [ Validators.required, Validators.min( 0 ) ] ],
      'min_score': [ exam.min_score, [ Validators.required, Validators.min( 0 ) ] ],
      'group': [ exam.group, [ Validators.required ] ],
      'taken_at': [ exam.taken_at, [ Validators.required ] ],
      'is_diagnostinis': [ exam.is_diagnostinis ],
    });
  }

  saveExam() {
    this.form.markAllAsTouched();
    if ( !this.form.valid ) return;

    let e : IEditExam = {
      name: this.form.get( 'name' ).value,
      max_score: this.form.get( 'max_score' ).value,
      min_score: this.form.get( 'min_score' ).value,
      group: this.form.get( 'group' ).value,
      taken_at: this.form.get( 'taken_at' ).value == '' ? null : this.form.get( 'taken_at' ).value,
      owner: this.exam.owner,
      id: this.exam.id,
      is_diagnostinis: this.form.get( 'is_diagnostinis' ).value,
    }

    let toast = this.toastService.pushAjaxLoadingNotification();
    this.examService.saveExam( e ).subscribe(
      () => {
        toast.message = "Atsiskaitymas sėkmingai užsaugotas"
        toast.type = NotificationType.SUCCESS
        toast.timeout = 7000
        this.toastService.updateNotification( toast );

        // Open the newly created test
        this.location.back();
      },
      () => {
        toast.title = "Klaida!"
        toast.message = "Nepavyko išsaugoti atsiskaitymo. Patikrinkite įvestus duomenis ir bandykite dar kartą"
        toast.timeout = 10000
        toast.type = NotificationType.ERROR
        this.toastService.updateNotification( toast )
      }
    );
  }

}

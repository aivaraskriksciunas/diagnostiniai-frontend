import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StudentsService } from '../../../shared/services/students.service';
import { StudentModel } from '../../../shared/models/student.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss', '../../shared/styles/pages.styles.scss']
})
export class EditStudentComponent {

  public student : StudentModel;
  public isLoading : boolean = true;
  public form : FormGroup;

  constructor(
    private activatedRoute : ActivatedRoute,
    private studentService : StudentsService,
    private formBuilder : FormBuilder,
    private toastService : ToastNotificationService,
    private location : Location
    ) { 
    this.activatedRoute.paramMap.subscribe(
      p => {
        this.isLoading = true;
        this.studentService.getStudent( p.get( 'id' ) ).subscribe(
          student => { 
            this.isLoading = false; 
            this.student = student;
            this.createForm();
          }
        )
      }
    );
  }

  private createForm() {
    this.form = this.formBuilder.group({
      'first_name': [ this.student.first_name, [ Validators.required ] ],
      'last_name': [ this.student.last_name, [ Validators.required ] ]
    })
  }

  public get firstName() {
    return this.form.get( 'first_name' );
  }

  public get lastName() {
    return this.form.get( 'last_name' );
  }

  public saveStudent() {
    let toast = this.toastService.pushAjaxLoadingNotification();
    this.studentService.updateStudent( this.student.id, {
      first_name: this.firstName.value,
      last_name: this.lastName.value
    } ).subscribe(
      () => {
        toast.title = "";
        toast.message = "Mokinio duomenys atnaujinti";
        toast.type = NotificationType.SUCCESS;
        toast.timeout = 3000;
        this.toastService.updateNotification( toast );
        this.location.back();
      },
      () => {
        toast.title = "Klaida";
        toast.message = "Nepavyko atnaujinti mokinio duomenų. Bandykite dar kartą";
        toast.type = NotificationType.ERROR;
        toast.timeout = 10000;
        this.toastService.updateNotification( toast );
      }
    )
  }

  public cancel() {
    this.location.back();
  }

}

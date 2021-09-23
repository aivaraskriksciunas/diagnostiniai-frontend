import { Component, OnInit, Input } from '@angular/core';
import { SubjectsService, ISubjectEdit } from 'src/app/shared/services/subjects.service';
import { ToastNotificationService, NotificationType } from '../../shared/services/toast-notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubjectsState } from 'src/app/shared/states/subjects.state';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss', '../../shared/styles/pages.styles.scss']
})
export class EditSubjectComponent implements OnInit {

  @Input( 'subject' ) public subject : ISubjectEdit;

  public form : FormGroup;

  constructor(
    private subjectService : SubjectsService,
    private toastNotifications : ToastNotificationService,
    private formBuilder : FormBuilder,
    private subjectState : SubjectsState
  ) { }

  ngOnInit() {
    if ( this.subject == null ) {
      this.subject = {
        name: '',
      }
    }

    // Create validation form
    this.form = this.formBuilder.group({
      name: [ 
        this.subject.name,
        Validators.required
      ]
    })
  }

  public saveSubject() {
    if ( !this.form.valid ) {
      this.toastNotifications.pushErrorNotification( "Klaida", "Prašome pilnai užpildyti visus laukus", 5000 );
      return;
    }

    let subject : ISubjectEdit = {
      id: this.subject.id,
      name: this.form.get( 'name' ).value,
    };

    let toast = this.toastNotifications.pushAjaxLoadingNotification();

    this.subjectService.saveSubject( subject ).subscribe(
      result => {
        toast.title = "Dalykas užsaugotas";
        toast.message = "";
        toast.timeout = 3000;
        toast.type = NotificationType.SUCCESS;
        this.form.reset();
        this.subjectService.getSubjectList().subscribe(
          list => this.subjectState.setState( list )
        )
      },
      error => {
        toast.title = "Klaida";
        toast.message = "Nepavyko išsaugoti dalyko!";
        toast.timeout = 5000;
        toast.type = NotificationType.ERROR;
      },
      () => {
        this.toastNotifications.updateNotification( toast );
      }
    )

  }

}

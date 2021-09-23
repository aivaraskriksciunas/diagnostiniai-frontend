import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DocumentsService } from '../../../shared/services/documents.service';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';

@Component({
  selector: 'app-upload-students',
  templateUrl: './upload-students.component.html',
  styleUrls: ['./upload-students.component.scss', '../../shared/styles/pages.styles.scss']
})
export class UploadStudentsComponent implements OnInit {

  private selectedFile : File = null;
  private yearId : number = null;
  public hasHeaders : boolean = true;

  public isLoading : boolean = false;

  public result = null;


  constructor(
    private location : Location,
    private documentService : DocumentsService,
    private currentTrimesterState : CurrentTrimesterState,
    private toastService : ToastNotificationService
  ) { }

  ngOnInit() {
    this.currentTrimesterState.getState().subscribe(
      t => {
        if ( !t.isSelected ) return;
        this.yearId = t.year.id
      }
    )
  }

  fileSelected( file : FileList ) {
    this.selectedFile = file.item( 0 );
  }

  upload() {
    this.isLoading = true;
    this.documentService.uploadStudents( this.selectedFile, this.hasHeaders, this.yearId ).subscribe(
      res => {
        this.result = res;
      },
      () => {
        this.toastService.pushErrorNotification( "Klaida keliant mokinius", "Nepavyko išsaugoti mokinių. Įsitikinkite, kad failas yra .xlsx formato ir jis yra tinkamo formato.", 10000 );
      },
      () => this.isLoading = false
    )
  }

  cancel() {
    this.location.back();
  }

}

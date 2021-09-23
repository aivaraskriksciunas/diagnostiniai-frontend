import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubjectModel } from '../../../../shared/models/subject.model';
import { SubjectsState } from '../../../../shared/states/subjects.state';

@Component({
  selector: 'app-subject-selector',
  templateUrl: './subject-selector.component.html',
  styleUrls: ['./subject-selector.component.scss']
})
export class SubjectSelectorComponent {

  @Input() subject : number = 0;
  @Output() subjectChange : EventEmitter<number> = new EventEmitter<number>(); 

  public subjects : SubjectModel[] = [];
  public isSubjectsLoading : boolean = true;


  constructor(
    private state : SubjectsState
  ) { 
    this.state.getState().subscribe(
      res => {
        if ( res == null ) {
          this.isSubjectsLoading = true;
          return;
        }

        this.subjects = res;
      }
    )
  }

  onSubjectChange( e ) {
    this.subject = e.target.value;
    this.subjectChange.emit( e.target.value );
  }

}

import { Component, OnInit } from '@angular/core';
import { SubjectsState } from '../../../../shared/states/subjects.state';
import { ClassesState } from '../../../../shared/states/classes.state';
import { SubjectModel } from '../../../../shared/models/subject.model';
import { GradeGroupModel } from 'src/app/shared/models/grade-group.model';
import { AuthenticationService, UserRoles } from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {

  public subjectList: SubjectModel[];
  public classesList: GradeGroupModel[];

  public isAdmin : boolean = false;

  constructor(
    private subjectsState: SubjectsState,
    private classesState : ClassesState,
    private authService : AuthenticationService
  ) { 
    this.isAdmin = this.authService.authenticatedUser.role == UserRoles.ADMINISTRATOR
  }

  ngOnInit() {
    // Listen to any changes to subject list
    this.subjectsState.getState().subscribe(
      subjects => this.subjectList = subjects
    );

    this.classesState.getState().subscribe(
      list => this.classesList = list
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { ExamsService } from 'src/app/shared/services/exams.service';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { IExamFilter } from '../../../shared/services/exams.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { PaginatedList } from '../../../shared/models/paginated_list.model';
import { ExamModel } from 'src/app/shared/models/exam.model';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';
import { GroupsService } from '../../../shared/services/groups.service';
import { SelectItem } from '../../shared/components/multiple-select/multiple-select.component';
import { SubjectsService } from 'src/app/shared/services/subjects.service';
import { map } from 'rxjs/operators';

interface ExamListItem {
  id: number,
  examName: string,
  groupName?: string,
  filledOut?: number,
  studentsTotal?: number,
  average?: number | string
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../shared/styles/pages.styles.scss']
})
export class ListComponent implements OnInit {

  public isExamsLoading : boolean = true;
  public isCourseGroupsLoading : boolean = true;

  public exams : ExamListItem[];

  private currentPage = 1;
  private resultsPerPage = 10;
  public totalResults = 0;

  private currentTrimester = 0;

  public availableGroups : SelectItem[] = []
  private selectedGroups : number[] = [];

  constructor(
    private examsService : ExamsService,
    private groupsService : GroupsService,
    private trimesterState : CurrentTrimesterState,
    private authService : AuthenticationService,
    private toastService : ToastNotificationService,
    private subjectService : SubjectsService,
  ) { 
    this.trimesterState.getState().subscribe(
      state => {
        if ( state.isSelected == false ) return;

        this.currentTrimester = state.trimester.id;
        this.getExamList( );
      }
    )

    this.subjectService.getSubjectList().subscribe(
      list => this.availableGroups = list.map(
        ( sub ) : SelectItem => ({
          text: sub.name,
          value: sub.id,
          asyncChildrenLoader: ( val ) => this.groupsService.listGroups(
            { subject: val, trimester_id: this.trimesterState.getCurrentState().trimester.id }
          ).pipe(
            map(
              ( groupList ) : SelectItem[] => groupList.map(
                group => ({
                  text: group.name,
                  value: group.id,
                })
              )
            )
          ) 
        })
      )
    )
  }

  private getExamList() {
    this.isExamsLoading = true;

    let filter : IExamFilter = {
      trimester_id: this.currentTrimester,
      group_ids: this.selectedGroups,
      owner_id: this.authService.authenticatedUser.id,
    };

    this.examsService.listExams(
      filter, this.currentPage, this.resultsPerPage
    ).subscribe(
      list => this.setExams( list ),
      _ => this.toastService.pushErrorNotification( "", "Nepavyko gauti darbų sąrašo iš serverio", 10000 ),
      () => this.isExamsLoading = false
    )
  }

  private setExams( examList : PaginatedList<ExamModel> ) {
    this.exams = [];
    this.totalResults = examList.count;

    for ( let i = 0; i < examList.results.length; i++ ) {
      this.exams.push({
        id: examList.results[i].id,
        examName: examList.results[i].name,
      });

      this.examsService.getExamDetail( examList.results[i].id ).subscribe(
        res => {
          this.exams[i].filledOut = res.marks.length;
          let markSum = 0;
          if ( res.marks.length != 0 ) {
            res.marks.forEach( val => markSum += val.mark );
            let average = (markSum / res.marks.length);
            this.exams[i].average = ( ( average / res.max_score ) * 100 ).toFixed( 2 ) + "%";
          }
          else { this.exams[i].average = '-' }
          
        }
      );

      this.groupsService.getGroupDetail( examList.results[i].group ).subscribe(
        res => {
          this.exams[i].studentsTotal = res.students.length;
          this.exams[i].groupName = res.name + " (" + res.subject.name + ")";
        }
      );
    }
  }

  public onGroupsSelected( groups ) {
    this.selectedGroups = groups;

  }

  public findTests() {
    this.currentPage = 1;

    this.getExamList();
  }

  public onPageChanged( page ) {
    this.currentPage = page;

    this.getExamList();
  }

  ngOnInit() {
  }

}

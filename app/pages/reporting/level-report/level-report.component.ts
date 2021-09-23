import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClassesService } from '../../../shared/services/classes.service';
import { CurrentTrimesterState } from '../../../shared/states/current-trimester.state';
import { SelectItem, CheckboxState } from '../../shared/components/multiple-select/multiple-select.component';
import { ToastNotificationService } from '../../shared/services/toast-notification.service';
import { GradeGroupDetail } from '../../../shared/models/grade-group.model';
import { map } from 'rxjs/operators';
import { ExamsService } from '../../../shared/services/exams.service';
import { ReportingService } from '../../../shared/services/reporting.service';

@Component({
  selector: 'app-level-report',
  templateUrl: './level-report.component.html',
  styleUrls: ['./level-report.component.scss', '../../shared/styles/pages.styles.scss']
})
export class LevelReportComponent implements OnInit {

  public classesLoading: boolean = true;
  public classesChoices: SelectItem[] = [];
  public subject: number = 0;
  public availableExamChoices: SelectItem[] = [];
  public examsLoading: boolean = true;

  public selectedStudents: number[] = [];
  public selectedExams: number[] = [];
  public selectedLevel: string = 'NEPATENKINAMAS';

  public chartLoading: boolean = false;
  public result: any[] = [];

  private currentTrimester: number = 0;

  constructor(
    private classService: ClassesService,
    private currentTrimesterState: CurrentTrimesterState,
    private toastService: ToastNotificationService,
    private examsService: ExamsService,
    private reportingService: ReportingService,
  ) {
    this.currentTrimesterState.getState().subscribe(
      t => {
        if (t == null || t.isSelected == false) return;
        this.currentTrimester = t.trimester.id;
        this.createChoices(t.year.id)
      }
    );
  }

  createChoices(school_year) {
    this.classesLoading = true;

    let i = 0;

    this.classService.getClassesList({
      year_id: school_year
    }).subscribe(
      res => {
        this.classesChoices = res.map(
          (l): SelectItem => ({
            text: l.grade + l.letter,
            value: l.id,
            asyncChildrenLoader: (value) => {
              return this.classService.getClassDetail(value).pipe(
                map((detail: GradeGroupDetail) => detail.students.map(
                  stud => ({
                    text: stud.first_name + ' ' + stud.last_name,
                    value: stud.id,
                  })
                )),
              )
            }
          })
        )
      },
      () => this.toastService.pushErrorNotification("Klaida", "Nepavyko gauti klasių sąrašo. Perkraukite puslapį ir bandykite dar kartą", 12000),
      () => this.classesLoading = false
    )
  }

  ngOnInit() {
  }

  studentsSelected(students) {
    this.selectedStudents = students;
    if (students.length == 0) {
      return;
    }

    this.getStudentsExamList();
  }

  getStudentsExamList() {

    this.examsLoading = true;
    this.selectedExams = [];

    this.examsService.getStudentsExams(this.selectedStudents, this.subject, this.currentTrimester).subscribe(
      (res) => {
        if (res.length == 0) {
          this.availableExamChoices = [];
          return;
        }

        this.availableExamChoices = res[0]['exams'].map(
          e => ({
            text: e.name,
            value: e.id,
            state: CheckboxState.SELECTED,
          })
        )
      },
      () => {
        this.toastService.pushErrorNotification('Klaida', 'Nepavyko gauti darbų sąrašo iš serverio. Bandykite dar kartą', 12000)
      },
      () => {
        this.examsLoading = false;
      }
    )
  }

  onExamSelect(exams) {
    this.selectedExams = exams;
  }


  getGraphData() {
    this.chartLoading = true;
    this.reportingService.getLevelReport(
      this.selectedStudents, this.selectedExams, this.currentTrimester, this.selectedLevel
    ).subscribe(
      res => this.result = res[0]['exams'] || [],
      () => this.toastService.pushErrorNotification("Klaida", "Nepavyko gauti mokinių sąrašo. Bandykite dar kartą", 12000),
      () => this.chartLoading = false
    )
  }

  downloadGraphData() {
    this.reportingService.downloadLevelReport(
      this.selectedStudents, this.selectedExams, this.currentTrimester, this.selectedLevel
    ).subscribe(
      () => { },
      () => this.toastService.pushErrorNotification("Klaida", "Nepavyko gauti failo iš serverio. Bandykite dar kartą", 10000)
    )
  }

}

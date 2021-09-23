import { State } from './state';
import { Injectable } from '@angular/core';
import { SubjectModel } from '../models/subject.model';


@Injectable({ providedIn: 'root' })
export class SubjectsState extends State<SubjectModel[]> {

    public insertSubject( subject : SubjectModel ) {
        let subjects = this.getCurrentState();
        subjects.push( subject );
        subjects.sort( ( a, b ) => a.name > b.name ? 1 : -1 );
        this.setState( subjects );
    }
}
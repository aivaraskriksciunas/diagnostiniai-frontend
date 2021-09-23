import { State } from './state';
import { Injectable } from '@angular/core';
import { GradeGroupModel } from '../models/grade-group.model';

@Injectable({ providedIn: 'root' })
export class ClassesState extends State<GradeGroupModel[]> {

    public insertClass( subject : GradeGroupModel ) {
        
    }
}
import { State } from './state';
import { Injectable } from '@angular/core';
import { TrimesterModel, SchoolYearModel } from '../models/trimester.model';

export interface CurrentTrimester {
    trimester: TrimesterModel,
    year: SchoolYearModel
}

export interface IYearTrimesterData {
    school_years: SchoolYearModel[],
}

  
@Injectable({ providedIn: 'root' })
export class TrimesterState extends State<IYearTrimesterData> {

    constructor() {
        super();
        
        this.setState({
            school_years: [],
        });
    }

    public setSchoolYears( school_years : SchoolYearModel[] ) {
        let val = this.getCurrentState();
        val.school_years = school_years;
        this.setState( val );
    }
}
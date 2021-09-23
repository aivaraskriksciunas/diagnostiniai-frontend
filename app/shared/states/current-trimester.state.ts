import { State } from './state';
import { Injectable } from '@angular/core';
import { TrimesterModel, SchoolYearModel } from '../models/trimester.model';
import { TrimesterState } from 'src/app/shared/states/trimesters.state';

export interface CurrentTrimester {
    trimester: TrimesterModel,
    year: SchoolYearModel,
    isSelected: boolean
}

  
@Injectable({ providedIn: 'root' })
export class CurrentTrimesterState extends State<CurrentTrimester> {

    constructor(
        private trimesterState: TrimesterState
    ) {
        super();
        
        this.setState({
            trimester: null,
            year: null,
            isSelected: false
        });
    }

    public setCurrentTrimester( trimester : CurrentTrimester ) {
        this.setState( trimester )
    }

    public setCurrentTrimesterById( trimester_id : number )  {
        let trimesters = this.trimesterState.getCurrentState();

        // Find trimester in the list of trimesters
        for ( let y = 0; y < trimesters.school_years.length; y++ ) {
            let year = trimesters.school_years[y];
            for ( let t = 0; t < year.trimesters.length; t++ ) {
                let tri = year.trimesters[t];
                if ( tri.id != trimester_id ) continue;
                
                this.setState({
                    trimester: tri,
                    year: year,
                    isSelected: true
                })
                return;
            }
        }

        this.setState({
            trimester: null,
            year: null,
            isSelected: false
        });
    }
}
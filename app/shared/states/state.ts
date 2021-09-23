import { BehaviorSubject } from 'rxjs';

export abstract class State<T> {

    private state : BehaviorSubject<T>;

    constructor() {
        this.state = new BehaviorSubject<T>( null );
    }

    public setState( state : T ) {
        this.state.next( state );
    };

    public getState() : BehaviorSubject<T> {
        return this.state;
    };

    public getCurrentState() : T {
        return this.state.getValue();
    }

}
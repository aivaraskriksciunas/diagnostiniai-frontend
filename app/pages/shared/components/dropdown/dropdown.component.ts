import { Component, OnInit, Input, ContentChildren, Directive, ContentChild, HostListener, ElementRef, QueryList, Output, EventEmitter, AfterViewInit, Host } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';

@Directive({ selector: 'dropdown-item'})
export class DropdownItem {
  @Input() clickable : boolean = true;
  @Input() value : any;
  @Output() selected : EventEmitter<any> = new EventEmitter<any>();

  constructor( private el : ElementRef ) {}

  @HostListener( 'click' ) onMouseClick() {
    if ( this.clickable ) {
      this.selected.emit( null );
      this.el.nativeElement.classList.remove( 'hovered' );
    }
  }

  @HostListener( 'mouseenter' ) onMouseEnter() {
    if ( !this.clickable ) return;

    this.el.nativeElement.classList.add( 'hovered' );
  }

  @HostListener( 'mouseleave' ) onMouseLeave() {
    if ( !this.clickable ) return;

    this.el.nativeElement.classList.remove( 'hovered' );
  }

}

@Directive({ selector: 'dropdown-button'})
export class DropdownButton {
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: [],
  animations: [

  ]
})
export class DropdownComponent implements OnInit {

  @Input( 'title' ) public title : string;
  @Input( 'align' ) public align : string = 'left';
  @ContentChildren( DropdownItem, { descendants: true } ) public items : QueryList<DropdownItem>; 
  @ContentChild( DropdownButton, {static: false} ) public button; 

  public isOpen : boolean = false;
  public isFocused : boolean = false;

  private mouseClickObservable : Observable<Event>;

  constructor() { 
    this.mouseClickObservable = fromEvent( document, 'click' );
    // Close the dropdown if user clicked outside
    this.mouseClickObservable.subscribe( _ => {
      if ( !this.isFocused ) this.isOpen = false
    } )
  }

  ngOnInit() {}
  ngAfterViewInit(): void {
    // Attach event listeners when items list changes
    this.items.changes.subscribe(
      _ => {
        // If user clicks on a clickable item, hide the menu
        this.items.forEach( item => 
          item.selected.subscribe( 
          _ => this.isOpen = false ) 
        );
      }
    )
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  onMouseLeave() {
    this.isFocused = false;
  }

  onMouseEnter() {
    this.isFocused = true;
  }

}

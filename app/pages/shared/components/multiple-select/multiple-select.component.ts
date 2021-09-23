import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { trigger } from '@angular/animations';

export enum CheckboxState {
  SELECTED,
  NOT_SELECTED,
  INDETERMINATE
}

export interface SelectItem {
  text: string,
  value?: any,
  children?: SelectItem[],
  expanded?: boolean,
  selectable?: boolean,
  state?: CheckboxState,
  _childrenLoading?: boolean,
  _childrenError?: string,
  asyncChildrenLoader?: ( value: any ) => Observable<SelectItem[]>,
}

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss'],
})
export class MultipleSelectComponent implements OnInit {

  @Input('items') items : any = [];
  @Input('maxHeight') maxHeight : number = 200;
  @Output( 'change' ) change : EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.change.emit( this.getSelectedValues( this.items ) ))
  }

  onExpand( item : SelectItem ) {
    if ( item.children == null || item.children.length == 0 ) {
      // Try to fetch children asyncronously
      if ( item.asyncChildrenLoader != null ) {
        // Set it as loading
        item._childrenLoading = true;
        item.asyncChildrenLoader( item.value ).subscribe(
          res => { 
            item.children = res 
          },
          () => {
            item._childrenError = "Klaida"
          },
          () => {
            item._childrenLoading = false;
            item.expanded = true;
          }
        )
      }
    }
    // If this item already has children elements, just toggle it
    else {
      item.expanded = !item.expanded;
    }

  }

  onSelect( item : SelectItem ) {
    if ( item.state == CheckboxState.SELECTED ) {
      this.setItemState( item, CheckboxState.NOT_SELECTED )
    }
    else {
      this.setItemState( item, CheckboxState.SELECTED )
    }

    this.items.forEach( element => {
      this.updateCheckStatus( element )
    });

    // Send an event with all the selected values
    var selectedValues = this.getSelectedValues( this.items )
    this.change.emit( selectedValues )
  }

  private setItemState( item : SelectItem, state : CheckboxState ) {
      // Check if item has any children, if so, set their status
      if ( item.children != null ) {
        item.state = CheckboxState.SELECTED
        item.children.forEach( child => this.setItemState( child, state ) )
      }
      // Check if this item's children should be loaded asyncronously
      else if ( item.asyncChildrenLoader != null ) {
        item._childrenLoading = true;
        // item.state = CheckboxState.SELECTED
        item.asyncChildrenLoader( item.value ).subscribe(
          res => { 
            item.children = res 
          },
          () => {
            item._childrenError = "Klaida"
          },
          () => {
            item._childrenLoading = false;
            // Expand the item automatically
            item.expanded = true;
          }
        )
      }
      else {
        item.state = state
      }
  }

  private updateCheckStatus( item : SelectItem ) {
    if ( item.children == null ) return;

    let selectedChildrenCount = 0, hasIndeterminateItems = false;
    for ( let i = 0; i < item.children.length; i++ ) {
      if ( item.children[i].children != null ) {
        this.updateCheckStatus( item.children[i] )
      }

      if ( item.children[i].state == CheckboxState.SELECTED ) {
        selectedChildrenCount++;
      }
      else if ( item.children[i].state == CheckboxState.INDETERMINATE ) {
        hasIndeterminateItems = true;
      }
    }

    // Now decide which status to give to the current checkbox
    if ( selectedChildrenCount == 0 ) {
      item.state = CheckboxState.NOT_SELECTED;
    }
    else if ( selectedChildrenCount < item.children.length || hasIndeterminateItems ) {
      item.state = CheckboxState.INDETERMINATE
    }
    else if ( selectedChildrenCount == item.children.length ) {
      item.state = CheckboxState.SELECTED
    }
  }

  private getSelectedValues( items : SelectItem[] ) : any[] {
    let selectedValues = [];

    for ( let i = 0; i < items.length; i++ ) {
      if ( items[i].children != null ) {
        let vals = this.getSelectedValues( items[i].children )
        selectedValues.push( ...vals )
      }
      else if ( items[i].state == CheckboxState.SELECTED && items[i].value != null ) {
        selectedValues.push( items[i].value )
      }
    }
    return selectedValues;

  }

}

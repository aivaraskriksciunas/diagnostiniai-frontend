import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem, CheckboxState } from '../multiple-select.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-multiple-select-item',
  templateUrl: './multiple-select-item.component.html',
  styleUrls: ['./multiple-select-item.component.scss'],
  animations: [
    trigger( 'expandCollapse', [
      state( 'expanded', style({}) ),

      state( 'collapsed', style({
        height: 0,
      }) ),

      transition( 'expanded <=> collapsed', [
        animate( '0.2s ease-out' )
      ] ),
    ] ),

    trigger( 'expandCollapseChevron', [
      state( 'expanded', style({
        transform: 'rotate(180deg)'
      }) ),

      state( 'collapsed', style({
        transform: 'rotate( 0deg )'
      }) ),
      transition( 'expanded <=> collapsed', [
        animate( '0.2s ease-out' )
      ] ),

    ] )
  ]
})
export class MultipleSelectItemComponent implements OnInit {

  @Input() item : SelectItem;
  @Output() onClick : EventEmitter<SelectItem> = new EventEmitter<SelectItem>()
  @Output() onExpand : EventEmitter<SelectItem> = new EventEmitter<SelectItem>()

  // Enum redeclaration for template
  public SELECTED = CheckboxState.SELECTED
  public NOT_SELECTED = CheckboxState.NOT_SELECTED
  public INDETERMINATE = CheckboxState.INDETERMINATE

  constructor() { }

  ngOnInit() {
  }

  expand( event ) {
    event.stopPropagation();
    
    this.onExpand.emit( this.item );
  }

  clicked( event ) {
    this.onClick.emit( event )
  }
}

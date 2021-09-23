import { Component, OnInit, Input } from '@angular/core';
import { state, style, transition, animate, trigger } from '@angular/animations';

@Component({
  selector: 'app-expand-item',
  templateUrl: './expand-item.component.html',
  styleUrls: ['../left-menu.component.scss'],

  animations: [
    trigger( 'listExpand', [
      state( 'closed', style({
        height: 0
      })),
      
      state( 'expanded', style({}) ),
  
      transition( 'closed <=> expanded', [
        animate( '200ms ease-out' )
      ] )
    ] ),

    trigger( 'expandArrow', [
      state( 'closed', style({
        transform: 'rotate(0)'
      }) ),

      state( 'expanded', style({
        transform: 'rotate( 0.5turn )'
      }) ),

      transition( 'closed <=> expanded', [
        animate( '250ms ease-in-out' )
      ] )
    ])
  ]
})
export class ExpandItemComponent implements OnInit {

  @Input( 'title' ) public title : string = '';
  public expanded : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public toggleExpanded() {
    this.expanded = !this.expanded;
  }

}

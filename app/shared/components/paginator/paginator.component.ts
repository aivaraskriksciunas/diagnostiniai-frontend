import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input( 'total' ) public total : number;
  @Input( 'itemsPerPage' ) public itemsPerPage : number = 30;
  @Input( 'page' ) public currentPage : number = 1;
  @Input( 'linkCount' ) public linkCount : number = 6;
  
  @Output( 'pageChanged' ) public pageChanged = new EventEmitter<number>();

  public links : number[] = [];

  constructor() { 
    this.constructLinks();
  }

  ngOnInit() {
  }
  
  ngOnChanges( changes: SimpleChanges ): void {
    this.constructLinks()
  }

  private constructLinks() {
    this.links = [];
    let pageCount = Math.ceil( this.total / this.itemsPerPage );
    let start = Math.max( 1, this.currentPage - Math.floor( this.linkCount / 2 ) );
    let end = Math.min( pageCount, this.currentPage + Math.floor( this.linkCount / 2 ) );

    for ( let i = start; i <= end; i++ ) {
      this.links.push( i );
    }

    // Add a link to the last page
    if ( end != pageCount ) {
      this.links.push( pageCount );
    }
    if ( start != 1 ) {
      this.links = [ 1 ].concat( this.links );
    }
  }

  public onPageSelected( page ) {
    this.pageChanged.emit( page );
  }

}

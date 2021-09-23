import { Component, OnInit, Directive } from '@angular/core';

@Directive({ selector: 'modal-header' })
export class ModalHeader {
  constructor() {}
}

@Directive({ selector: 'modal-content' })
export class ModalContent {
  constructor() {}
}

@Directive({ selector: 'modal-actions' })
export class ModalActions {
  constructor() {}
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss', '../../styles/pages.styles.scss'],
  animations: [
    
  ]
})
export class ModalComponent implements OnInit {

  public isOpen : boolean = false;
  // Used for checking if user clicked on backdrop
  public mouseOverModal : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  _mouseEnter() {
    this.mouseOverModal = true;
  }

  _mouseLeave() {
    this.mouseOverModal = false;
  }

  _backdropClicked() {
    if ( !this.mouseOverModal ) this.close();
  }

}

import { Directive, ElementRef } from '@angular/core';
import flatpickr from 'flatpickr';

@Directive({
  selector: '[flatpickr]'
})
export class FlatpickrDirective {

  private pickerInstance;

  constructor( private element : ElementRef ) { 
    let config = {
      dateFormat: 'Y-m-d'
    }
    this.pickerInstance = flatpickr( this.element.nativeElement, config );
  }

}

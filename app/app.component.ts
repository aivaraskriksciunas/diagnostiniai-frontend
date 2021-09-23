import { Component } from '@angular/core';
import flatpickr from 'flatpickr';

declare var require: any;
const Lithuanian = require("flatpickr/dist/l10n/lt.js").default.lt;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Diagnostiniai';

  constructor() {
    flatpickr.localize( flatpickr.l10ns.lt );
  }
}

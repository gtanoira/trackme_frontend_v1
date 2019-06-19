import { Component, Input } from '@angular/core';

// Templates & CSS
import spinnerComponentHtml from './spinner.component.html';
// import spinnerComponentCss  from './spinner.component.css';

/**
 * @title Configurable progress spinner
 */
@Component({
  selector: 'loading-spinner',
  template: spinnerComponentHtml
  // styles:   [spinnerComponentCss.toString()],
})
export class ProgressSpinner {

  @Input() color: string;
  @Input() mode: string;
  @Input() value: number;
  title: string = '';
  titleLocation: string = 'top';  // top / right / botton / left / hide

  constructor() {
    this.color = (this.color) ? this.color : 'primary';
    this.mode  = (this.mode)  ? this.mode  : 'indeterminate';
    this.value = (this.value) ? this.value : 50;
    this.title = (this.title) ? this.title : 'loading ...';
    this.titleLocation = (this.titleLocation) ? this.titleLocation : 'top';
  }

}

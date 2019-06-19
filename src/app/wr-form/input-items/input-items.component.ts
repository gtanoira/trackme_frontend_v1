import { Component } from '@angular/core';

// Shared Services
import { ModalService } from '../../shared/modal.service';

// Templates & CSS
import inputItemsComponentHtml from './input-items.component.html';
// import inputItemsComponentCss  from './input-items.component.css';

@Component({
  selector: 'app-input-items',
  template: inputItemsComponentHtml,
  // styles:   [inputItemsComponentCss.toString()],
})
export class InputItemsComponent  {

 
  constructor(
    private modalService: ModalService
  ) { }

  public close() {
    this.modalService.destroy();
  }
 
}
import { Component, OnInit } from '@angular/core';

// HTML & CSS
import headerComponentHtml from './header.component.html';
import headerComponentCss from './header.component.css';

@Component({
  selector: 'app-header',
  template: headerComponentHtml,
  styles: [headerComponentCss]
})

export class HeaderComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material';

// Templates & CSS
import tabGroupComponentHtml from './tab-group.component.html';
import tabGroupComponentCss  from './tab-group.component.css';

// App Components
import { AppComponent } from '../grid/app.component';
import { CustomerOrderFormComponent } from '../custorders-form/form.component';

/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-tabs',
  styles:   [tabGroupComponentCss.toString()],
  template: tabGroupComponentHtml
})
export class TabGroup {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('addGrid') addGridTab: MatTab;
  public dynamicTabs = [];
  selected = new FormControl(0);
  tabNo = 0;

  addTab() {
    this.tabNo += 1;
    this.dynamicTabs.push({
      label: `Grid (${this.tabNo})`,
      component: AppComponent,
      inputs: { tabGroup: this }
    });
    this.addGridTab.isActive = false;
    this.tabGroup.selectedIndex = this.dynamicTabs.length - 1;
  }

  addTabCustomerForm(orderId: number = null) {
    this.tabNo += 1;
    this.dynamicTabs.push({
      label: `Order (${this.tabNo})`,
      component: CustomerOrderFormComponent,
      inputs: { orderId }
    });
    this.addGridTab.isActive = false;
    this.tabGroup.selectedIndex = this.dynamicTabs.length - 1;
  }

  removeTab(tab: any) {
    const index = this.dynamicTabs.indexOf(tab);
    this.dynamicTabs.splice(index, 1);
    if (this.selected.value > this.dynamicTabs.length - 1) {
      if (this.dynamicTabs.length >= 1) {
        this.selected.setValue(this.dynamicTabs.length - 1);
      } else {
        this.selected.setValue(0);
      }
    }
  }

  onLinkClick(event: MatTabChangeEvent) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
  }
}

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material';

// App Components
import { COrderGridComponent } from './grid/grid.component';
import { COrderFormComponent } from './form/form.component';

/**
 * Customer Orders TAB manager
 * This component manages dynamically 2 components:
 * a) the customer orders grid component
 * b) the customer orders form component
 * And show these 2 components dynamically in tabs on the screen.
 * It can display these componenet more than once in different tabs
 */
@Component({
  templateUrl: './customer_order_tabs.component.html',
  styleUrls:   ['./customer_order_tabs.component.css'],
  host: {
    style: 'height: calc(100% - 60px);'
  }
})
export class CustomerOrderTabsComponent {
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;  // All tabs info that are available in the screen
  @ViewChild('addGrid', {static: false}) addGridButton: MatTab;  // Info of the button "add a new grid"

  // cOrdersTabs[]: stores all the tab components the user opens.
  public cOrdersTabs = [];
  tabSelected = new FormControl(0);   // Info of the tab selected by clicking on it
  tabNo = 0;  // number to identify each tab

  constructor () {}

  // Add a new Customer Order Grid tab
  addCOrdersGridTab() {
    this.tabNo += 1;
    // Add the new tab component to the dynamic array
    this.cOrdersTabs.push({
      label: `Grid (${this.tabNo})`,
      component: COrderGridComponent,
      inputs: { tabGroup: this }
    });
    // Set the tab active
    // The setTimeout() is a trick to get this work
    setTimeout(() => { this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1; }, 0);
  }

  addCOrdersFormTab(orderId: number = null) {
    this.tabNo += 1;
    this.cOrdersTabs.push({
      label: `Order (${this.tabNo})`,
      component: COrderFormComponent,
      inputs: { orderId }
    });
      // Set the tab active
      // The setTimeout() is a trick to get this work
      setTimeout(() => { this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1; }, 0);
  }

  removeTab(tab: any) {
    const index = this.cOrdersTabs.indexOf(tab);
    this.cOrdersTabs.splice(index, 1);
    if (index >= this.cOrdersTabs.length) {
      // Set the tab active
      // The setTimeout() is a trick to get this work
      setTimeout(() => { this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1; }, 0);
    }
    /*
    if (this.tabSelected.value > this.cOrdersTabs.length - 1) {
      if (this.cOrdersTabs.length >= 1) {
        this.tabSelected.setValue(this.cOrdersTabs.length - 1);
      } else {
        this.tabSelected.setValue(0);
      }
    }
    */
  }

  onLinkClick(event: MatTabChangeEvent) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
  }
}

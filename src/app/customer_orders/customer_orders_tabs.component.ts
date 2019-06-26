import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material';
import { NgComponentOutlet } from '@angular/common';

// App Components
import { COrdersGridComponent } from './grid/grid.component';
// import { CustomerOrderFormComponent } from '../custorders-form/form.component';

/**
 * Customer Orders TAB manager
 * This component manages dynamically 2 components:
 * a) the customer orders grid component
 * b) the customer orders form component
 * And show these 2 components dynamically in tabs on the screen.
 * It can display these componenet more than once in different tabs
 */
@Component({
  templateUrl: './customer_orders_tabs.component.html',
  styleUrls:   ['./customer_orders_tabs.component.css'],
  host: {
    class: 'wrapper'
  }
})
export class CustomerOrdersTabsComponent {
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;  // All tabs info that are aailable in the screen
  //@ViewChild('addGrid', {static: false}) addGridTab: MatTab;  // Info of the button "add a new grid"

  // cOrdersTabs[]: stores all the tab components the user opens.
  public cOrdersTabs = [];
  tabSelected = new FormControl(0);   // Info of the tab selected by clicking on it
  tabNo = 0;  // number to identify each tab

  // Add a new Customer Order Grid tab
  addCOrdersGridTab() {
    this.tabNo += 1;
    // Add the new tab component to the dynamic array
    this.cOrdersTabs.push({
      label: `Grid (${this.tabNo})`,
      component: COrdersGridComponent,
      inputs: { tabGroup: this }
    });
    //this.addGridTab.isActive = false;
    this.tabGroup.selectedIndex = this.cOrdersTabs.length;
    console.log('*** tabGroup:', this.tabGroup);
  }

  addCOrdersFormTab(orderId: number = null) {
    this.tabNo += 1;
    this.cOrdersTabs.push({
      label: `Order (${this.tabNo})`,
      //component: CustomerOrderFormComponent,
      inputs: { orderId }
    });
    //this.addGridTab.isActive = false;
    this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1;
  }

  removeTab(tab: any) {
    const index = this.cOrdersTabs.indexOf(tab);
    this.cOrdersTabs.splice(index, 1);
    if (this.tabSelected.value > this.cOrdersTabs.length - 1) {
      if (this.cOrdersTabs.length >= 1) {
        this.tabSelected.setValue(this.cOrdersTabs.length - 1);
      } else {
        this.tabSelected.setValue(0);
      }
    }
  }

  onLinkClick(event: MatTabChangeEvent) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
  }
}

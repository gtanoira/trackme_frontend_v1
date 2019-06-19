import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Template & CSS
import tabsComponentHtml from './tabs.component.html';

// Structures and models
import { SelectOptions } from '../../models/select_options';
import { EventsModel }   from '../../models/events';
import { WarehouseReceiptOrders }   from '../../models/warehouse_receipt_orders';

// Private Components
import { WRFormComponent } from '../../wr-form/form.component';

// Services
import { ExchangeDataService } from '../../shared/data_exchange.service';

// Widgets

// HTTP options for calling API
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // 'Accept': 'text/plain; application/json; text/html;',
  })
};
/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-custorder-tabs',
  template: tabsComponentHtml,
  host: {
    class: 'wrapper'
  }
})
export class CustomerOrderTabs implements OnInit {
  @Input() orderId: number;
  @Input() formData: FormGroup;
  @Input() customerOptions: SelectOptions[];

  // Select-Options for fields
  countryOptions: SelectOptions[];
  companyOptions: SelectOptions[];

  // Define variables
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('addWR') addWRTab: MatTab;
  public dynamicTabs = [];
  selected = new FormControl(0);

  constructor(private http:      HttpClient,
              private dataExchg: ExchangeDataService
              ) {}

  ngOnInit() {

    // Get Company Options
    this.http.get<SelectOptions[]>('/api/companies.json')
      .subscribe(data => {
        this.companyOptions = data.map(row => {
          return row;
        });
      });

    // Get Country Options
    this.http.get<SelectOptions[]>('/api/countries.json')
      .subscribe(data => {
        this.countryOptions = data.map(row => {
          return row;
        });
      });

    // Load all Warehouse Receipts for the Customer Order
    this.addWRTabs(this.orderId);
  }

  // Add a new Shipment Order
  addShipment() {
    null;
  }

  addWReceipt() {
    if (this.formData.value.formProperties.mode === 'INSERT') {
      this.dataExchg.changeFormMessage('TRK-0003(I): the form must be saved prior to this action');
    } else {
      this.dynamicTabs.push({
        label: 'WR-new',
        component: WRFormComponent,
        remove: true,
        inputs: {
          orderId: null,
          customerOrderForm: this.formData
        }
      });
      this.addWRTab.isActive = false;
      console.log('*** tabGroup: ', this.tabGroup);
      this.tabGroup.selectedIndex = 5 + this.dynamicTabs.length - 1;  // set active TAB
    }
  }

  // Add all WR Tabs to the FORM
  addWRTabs(customerOrderId: number) {
    // Get all WR Nos.
    this.http.get<WarehouseReceiptOrders[]>(`/api/warehouse_receipts/customer_order/get_ids/${customerOrderId}.json`)
      .subscribe(data => {
        for (const wr of data) {
          this.dynamicTabs.push({
            label: `WR#${wr.orderNo}`,
            remove: false,
            component: WRFormComponent,
            inputs: {
              orderId: wr.orderId,
              customerOrderForm: this.formData
            }
          });
        }
        // Set active TAB
        this.tabGroup.selectedIndex = 5;
      });
  }

  changeTab(event: any) {
    this.dataExchg.changeFormMessage('');
    this.selected.setValue(event);
  }

  removeTab(tab: any) {
    console.log('*** TAB: ', tab);
    const index = this.dynamicTabs.indexOf(tab);
    this.dynamicTabs.splice(index, 1);  // delete component or tab
    if (this.selected.value > this.dynamicTabs.length - 1) {
      if (this.dynamicTabs.length >= 1) {
        this.selected.setValue(this.dynamicTabs.length - 1);
      } else {
        this.selected.setValue(0);
      }
    }
  }

}

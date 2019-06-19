import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { GridOptions } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGridNg2 } from 'ag-grid-angular';
LicenseManager.setLicenseKey(
  'Evaluation_License_Not_For_Production_Valid_Until26_January_2019__MTU0ODQ2MDgwMDAwMA==21a7453ae27248a2d469f10e8f54b791'
);

// Models
import { ItemsModel }   from '../../models/items';
import { SelectOptions } from '../../models/select_options';

// Templates & CSS
import itemsComponentHtml from './items.component.html';
// import itemsComponentCss  from './events.component.css';

// Shared Services
import { ExchangeDataService }   from '../../shared/data_exchange.service';
import { ItemsService }          from '../../shared/items.service';

// Shared Widgets
import { ProgressSpinner } from '../../shared/spinner/spinner.component';
// import { AgGridLoadingOverlay } from '../../shared/spinner/custom_loading_aggrid.component';

// HTTP options for calling API
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // 'Accept': 'text/plain; application/json; text/html;',
  })
};

@Component({
  selector: 'app-wr-items',
  template: itemsComponentHtml,
  // styles:   [eventsComponentCss.toString()],
  host: {
    class: 'wrapper'
  }
})
export class ItemsComponent implements OnInit {
  @Input() orderId: number;
  @Input() formData: FormGroup;

  // Items's Grid Definitions
  columnDefs = [{
    headerName: 'Type',
    field: 'itemType',
    // width: 150,
    sort: 'asc',
    sortingOrder: ['asc', 'desc']
  }, {
    headerName: 'Item ID',
    field: 'itemId',
    // width: 300,
    sortingOrder: ['asc', 'desc']
  }, {
    headerName: 'Part No.',
    field: 'partNumber',
    // width: 300,
    sortingOrder: ['asc', 'desc']
  }, {
    headerName: 'Model',
    field: 'model',
    // width: 300,
    sortingOrder: ['asc', 'desc']
  }, {
    headerName: 'Serial Number',
    field: 'serialNumber',
    // width: 300,
  }, {
    headerName: 'Condition',
    field: 'condition',
    // width: 300,
    sortingOrder: ['asc', 'desc']
  }, {
    headerName: 'Contents',
    field: 'contents',
    // width: 300,
  }];
  rowData: ItemsModel[];
  private gridOptions: GridOptions;

  // New item's variables
  itemTypeOptions: SelectOptions[];
  itemFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private dataExchg: ExchangeDataService,
              private itemsService: ItemsService) {

    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      overlayLoadingTemplate: '<div class="loader-spinner"></div>',
    };
  }

  ngOnInit() {

    this.itemFormGroup = this.fb.group({
      type: [''],
      itemId: [''],
      partNumber: [''],
      serialNumber: [''],
      status: ['']
    });

    // Set the Items's Grid to listen to any changes and re-render the grid
    this.itemsService.findInternalOrderItems(this.orderId)
      .subscribe(data => this.rowData = data);
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}

function displayDate(params) {

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dic'];
  const dateToConvert = params.value;
  return params && params.value && `${dateToConvert.substring(8, 10)}
                                   -${months[parseInt(dateToConvert.substring(5, 7), 10) - 1]}
                                   -${dateToConvert.substring(0, 4)}
                                    ${ dateToConvert.substring(11, 19)}`;
}

import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GridOptions } from 'ag-grid-community';
//import { LicenseManager } from 'ag-grid-enterprise';
//LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__24_November_2018__MTU0MzAxNzYwMDAwMA==a39c92782187aa78196ed1593ccd1527');

// Models
import { CustomerOrderModel } from '../../../models/customer_order.model';

// Environment
import { environment } from '../../../environments/environment';

// Services
import { CustomerOrderService } from '../../../shared/customer_order.service';
import { CustomTooltip } from '../../../shared/custom-tooltip.component';

/* ***********************************************************************
    DATE formatting settings
*/
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { delay } from 'rxjs/operators';
import { MatButtonToggleGroupMultiple } from '@angular/material';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'll',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// *********************************************************************

@Component({
  selector: 'app-aggrid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  host: {
    class: 'wrapper'
  }
})
export class COrderGridComponent implements OnInit {
  // @Input() tabGroup: TabGroup;

  // ag-grid setup variables
  public  columnDefs;
  public  defaultColDef;
  public  frameworkComponents;
  private gridApi;
  private gridColumnApi;
  public  overlayLoadingTemplate;
  public  rowData: CustomerOrderModel[];

  /*
  private onQuickFilterChanged() {
    this.gridOptions.api.setQuickFilter(this.quickSearchValue);
  }
  */

  constructor(
    private customerOrdersService: CustomerOrderService,
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) {
    // Define columns of the ag-grid
    this.columnDefs = [{
      headerName: 'Client',
      field: 'customerName',
      filter: 'agTextColumnFilter',
      width: 210
    }, {
      headerName: 'Order #',
      field: 'orderNo',
      filter: 'agTextColumnFilter',
      width: 100
    }, {
      headerName: 'Client PO',
      field: 'custRef',
      filter: 'agTextColumnFilter',
      width: 160
    }, {
      headerName: 'SM',
      headerTooltip: 'Shipment Method',
      field: 'shipmentMethod',
      width: 50
    }, {
      headerName: 'Date',
      field: 'orderDate',
      sort: 'desc',
      sortingOrder: ['asc', 'desc'],
      width: 110,
      filter: 'agDateColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        applyButton: false,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('-');
          const cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      }
    }, {
      headerName: 'Shipper',
      children: [{
        headerName: 'Name',
        field: 'fromEntity',
        hide: false,
        width: 210
      }, {
        headerName: 'Country',
        field: 'fromCountryId',
        width: 90
      }, {
        headerName: 'City',
        field: 'fromCity',
        hide: false,
        width: 110
      }]
    }, {
      headerName: 'Consignee',
      children: [{
        headerName: 'Name',
        field: 'toEntity',
        hide: false,
        width: 210
      }, {
        headerName: 'Country',
        field: 'toCountryId',
        width: 90
      }, {
        headerName: 'City',
        field: 'toCity',
        hide: false,
        width: 110
      }]
    }, {
      headerName: 'Status',
      field: 'orderStatus',
      width: 70
    }, {
      headerName: 'Last Event',
      headerTooltip: 'Last Event',
      field: 'observations',
      width: 230
    }, {
      headerName: 'ETA',
      field: 'eta',
      sortingOrder: ['desc', 'asc'],
      width: 110,
      filter: 'agDateColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        applyButton: false,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('-');
          const cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      }
    }, {
      headerName: 'DD',
      headerTooltip: 'Delivery Date',
      field: 'deliveryDate',
      sortingOrder: ['desc', 'asc'],
      width: 110,
      filter: 'agDateColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        applyButton: false,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('-');
          const cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      }
    }];
    this.defaultColDef = {
      sortable: true,
      tooltipComponent: 'customTooltip',
      resizable: true
    };
    this.overlayLoadingTemplate = '<div class="loader-spinner"></div>';
    this.frameworkComponents = {
      customTooltip: CustomTooltip
    };
  }

  ngOnInit() {
  }

  // This routine is executed when the ag-grid is ready
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Get all customer orders data
    this.customerOrdersService.getAllCustomerOrders()
      .subscribe(
        data => this.gridApi.setRowData(data)
      );
  }
}

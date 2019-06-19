import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TabGroup } from '../app-tabs/tab-group.component';

import { CustordersShowModel } from '../models/custorders-show';

import appComponentHtml from './app.component.html';
import { GridOptions } from 'ag-grid-community';
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__24_November_2018__MTU0MzAxNzYwMDAwMA==a39c92782187aa78196ed1593ccd1527');

@Component({
  selector: 'app-custorder-grid',
  template: appComponentHtml,
  host: {
    class: 'wrapper'
  }
})
export class AppComponent {
  @Input() tabGroup: TabGroup;

  private gridOptions: GridOptions;
  public  rowData: any[];
  private columnDefs: any[];
  private defaultColDef;
  private sideBar;
  quickSearchValue: string = '';

  private onQuickFilterChanged() {
    this.gridOptions.api.setQuickFilter(this.quickSearchValue);
  }

  constructor(private http: HttpClient, private ref:ChangeDetectorRef) {
    const appComponent = this; // tslint:disable-line no-this-assignment
    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        this.http.get<CustordersShowModel[]>('/api/customer_orders.json')
          .subscribe(data => {
            this.rowData = data;
            const allColumnIds = [];
            this.columnDefs.forEach(columnDef => {
              allColumnIds.push(columnDef.field);
            });
            this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
          });
      },
      onRowDoubleClicked: row => appComponent.tabGroup.addTabCustomerForm(row.data.id),
      enableColResize: true,
      enableSorting: true,
      floatingFilter: true,
      overlayLoadingTemplate: '<div class="loader-spinner"></div>',
    };
    this.columnDefs = [{
      headerName: 'Client',
      field: 'name',
      filter:'agTextColumnFilter'
    }, {
      headerName: 'Order #',
      field: 'orderNo',
      filter:'agTextColumnFilter'
    }, {
      headerName: 'Cust PO',
      field: 'custRef',
      filter:'agTextColumnFilter'
    }, {
      headerName: 'SM',
      headerTooltip: 'Shipment Method',
      field: 'shipmentMethod'
    }, {
      headerName: 'Date',
      field: 'orderDate',
      sort: 'desc',
      sortingOrder: ['asc', 'desc'],
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
        hide: true
      }, {
        headerName: 'Country',
        field: 'fromCountryId'
      }, {
        headerName: 'City',
        field: 'fromCity',
        hide: true
      }]
    }, {
      headerName: 'Consignee',
      children: [{
        headerName: 'Name',
        field: 'toEntity',
        hide: true
      }, {
        headerName: 'Country',
        field: 'toCountryId'
      }, {
        headerName: 'City',
        field: 'toCity',
        hide: true
      }]
    }, {
      headerName: 'Status',
      field: 'orderStatus'
    }, {
      headerName: 'LE',
      headerTooltip: 'Last Event',
      field: 'observations'
    }, {
      headerName: 'ETA',
      field: 'eta',
      sortingOrder: ['desc', 'asc'],
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
      headerName: 'Delivered To',
      field: 'deliveredTo'
    }, {
      headerName: '# Pieces',
      field: 'pieceCount'
    }];
    this.defaultColDef = {
      enableValue: false,
      enableRowGroup: false,
      enablePivot: false
    };
    this.sideBar = {
      toolPanels: [{
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSideButtons: true,
          suppressColumnFilter: true,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: true
        }
      }],
      defaultToolPanel: ''
    };
  }
}

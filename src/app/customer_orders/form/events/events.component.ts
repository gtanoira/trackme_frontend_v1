import { Component, Input, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/*
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey(
  'Evaluation_License_Not_For_Production_Valid_Until26_January_2019__MTU0ODQ2MDgwMDAwMA==21a7453ae27248a2d469f10e8f54b791'
);
*/

// Models
import { EventModel } from '../../../../models/event.model';
import { EventTypeModel } from '../../../../models/event_type.model';
import { SelectOptions } from '../../../../models/select_options';

// Services
import { AgGridLoadingComponent } from '../../../../shared/spinners/ag_grid/ag-grid_loading.component';
import { CustomTooltip } from '../../../../shared/custom-tooltip.component';
import { ErrorMessageService } from '../../../../shared/error-message.service';
import { EventTypeService } from '../../../../shared/event_type.service';
import { HeightService } from '../../../../shared/height.service';
import { OrderEventService } from '../../../../shared/order_event.service';

/* ***********************************************************************
    DATE formatting settings
*/
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// import {default as _rollupMoment} from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// *********************************************************************

@Component({
  selector: 'app-custorder-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class COrderEventsComponent implements OnInit, AfterViewInit {
  @Input() orderId: number;
  @Input() formData: FormGroup;

  // Component Height
  componentHeight = {};

  // ag-grid setup variables
  public  columnDefs;
  public  defaultColDef;
  public  frameworkComponents;
  private gridApi;
  private gridColumnApi;
  public  loadingOverlayComponent;
  public  loadingOverlayComponentParams;
  public  overlayLoadingTemplate;
  public  rowData: EventModel[] = [];

  // New event variables
  eventTypeOptions: SelectOptions[];
  eventFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private orderEventService: OrderEventService,
    private eventTypeService: EventTypeService,
    private el: ElementRef,
    private heightService: HeightService,
    private renderer: Renderer2
  ) {

    // Event's Grid Definitions
    this.columnDefs = [
      {
        headerName: 'Date',
        field: 'eventDate',
        width: 150,
        sort: 'desc',
        sortingOrder: ['asc', 'desc'],
        valueFormatter: displayDate
      }, {
        headerName: 'Event',
        field: 'eventName',
        width: 300
      }, {
        headerName: 'Observations',
        field: 'observations',
        width: 660
      }
    ];
    this.defaultColDef = {
      sortable: true,
      tooltipComponent: 'customTooltip',
      resizable: true
    };
    this.frameworkComponents = {
      customLoadingOverlay: AgGridLoadingComponent,
      customTooltip: CustomTooltip
    };
    this.loadingOverlayComponent = 'customLoadingOverlay';
    this.loadingOverlayComponentParams = { loadingMessage: 'Loading ...' };
  }

  ngOnInit() {

    this.eventFormGroup = this.fb.group({
      eventDatetime: [''],
      eventTypeId: [''],
      observations: ['']
    });

    // Read the Event Types
    this.eventTypeService.getAllEventTypes()
      .subscribe(
        data => {
          this.eventTypeOptions = data.map(row => row);
        }
      );
  }

  ngAfterViewInit() {
    const parentElement = document.getElementsByTagName('mat-tab-header');
    console.log('*** MAT-TAB-HEADER element:', parentElement);
    console.log('*** EL:', this.el);
    setTimeout(() => {
      this.componentHeight = { height: `calc(100% - ${this.el.nativeElement.firstChild.offsetHeight}px)` };
    }, 2000);
  }

  // This routine is executed when the ag-grid is ready
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Spinner
    this.gridApi.showLoadingOverlay();

    // Get all events from the customer order
    this.orderEventService.getEventsFromCustomerOrder(this.orderId)
      .subscribe(
        data => this.gridApi.setRowData(data)
      );
  }

  addCustomerEvent(orderId) {

    // Check if the order is in UPDATE mode
    if (this.formData.value.formProperties.mode !== 'UPDATE') {
      this.errorMessageService.changeErrorMessage('TRK-0003(I): you must save the form first in order to add a new event.');

    // Check if the event type Id is null
    } else if (this.eventFormGroup.value.eventTypeId == null || this.eventFormGroup.value.eventTypeId === '') {
      this.errorMessageService.changeErrorMessage('TRK-0001(E): the field NEW EVENT cannot be empty.');

    // Add the new event to the DataBase
    } else {

      // Map data before send
      const customerOrderEvent = {
        orderId,
        eventDatetime: this.eventFormGroup.value.eventDatetime,
        eventTypeId:   this.eventFormGroup.value.eventTypeId,
        observations:  this.eventFormGroup.value.observations,
        eventScope:    'PUB'
      };

      // Add the new event in the DBase
      this.http.post(`/api/customer_orders/${orderId}/events.json`, customerOrderEvent)
        .subscribe(
          data => {
            this.errorMessageService.changeErrorMessage(data['message']);
            setTimeout(() => { this.errorMessageService.changeErrorMessage(''); }, 10000);   // delete the message after 10 secs.

            // Reread all the events of the order and show them on screen
            this.orderEventService.getEventsFromCustomerOrder(this.orderId)
              .subscribe(
                data => this.gridApi.setRowData(data)
              );
          },
          error => {
            this.errorMessageService.changeErrorMessage(
              `TRK-0004(E): creating the event(CustomerOrderEvent) in the DBase.// ${error['message']} // ${error['extraMsg']}`
            );
          }
        );
    }
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

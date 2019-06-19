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
import { EventsModel }   from '../../models/events';
import { SelectOptions } from '../../models/select_options';

// Templates & CSS
import eventsComponentHtml from './events.component.html';
import eventsComponentCss  from './events.component.css';

// Shared Services
import { ExchangeDataService }   from '../../shared/data_exchange.service';
import { OrderEventsService } from '../../shared/order_events.service';

// Shared Widgets
import { ProgressSpinner } from '../../shared/spinner/spinner.component';

// HTTP options for calling API
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // 'Accept': 'text/plain; application/json; text/html;',
  })
};

@Component({
  selector: 'app-custorder-events',
  template: eventsComponentHtml,
  styles:   [eventsComponentCss.toString()],
  host: {
    class: 'wrapper'
  }
})
export class CustomerEventsComponent implements OnInit {
  @Input() orderId: number;
  @Input() formData: FormGroup;

  // Event's Grid Definitions
  columnDefs = [{
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
  }];
  rowData: EventsModel[];
  private gridOptions: GridOptions;

  // New event variables
  eventTypeOptions: SelectOptions[];
  eventFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private dataExchg: ExchangeDataService,
              private orderEventsService: OrderEventsService) {

    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      overlayLoadingTemplate: '<div class="loader-spinner"></div>',
    };
  }

  ngOnInit() {

    this.eventFormGroup = this.fb.group({
      eventDatetime: [''],
      eventTypeId: [''],
      observations: ['']
    });

    // Read the Event Types
    this.http.get<SelectOptions[]>('/api/event_types.json')
      .subscribe(
        data => {
          this.eventTypeOptions = data.map(row => { return row; });
        }
      );

    // Set the Event's Grid to listen to any changes and re-render the grid
    this.orderEventsService.findCustomerOrderEvents(this.orderId)
      .subscribe(data => this.rowData = data);
  }

  addCustomerEvent(orderId) {

    // Check if the order is in UPDATE mode
    if (this.formData.value.formProperties.mode !== 'UPDATE') {
      this.dataExchg.changeFormMessage('TRK-0003(I): you must save the form first in order to add a new event.');

    // Check if the event type Id is null
    } else if (this.eventFormGroup.value.eventTypeId == null || this.eventFormGroup.value.eventTypeId === '') {
      this.dataExchg.changeFormMessage('TRK-0001(E): the field NEW EVENT cannot be empty.');

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
      this.http.post(`/api/customer_orders/${orderId}/events.json`, customerOrderEvent, httpOptions)
        .subscribe(
          data => {
            this.dataExchg.changeFormMessage(data['message']);
            setTimeout(() => { this.dataExchg.changeFormMessage(''); }, 10000);   // delete the message after 10 secs.

            // Reread all the events of the order and show them on screen
            this.orderEventsService.findCustomerOrderEvents(this.orderId)
              .subscribe(data => this.rowData = data);
          },
          error => {
            this.dataExchg.changeFormMessage(
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

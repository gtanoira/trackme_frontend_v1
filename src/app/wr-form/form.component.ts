import { Component, OnInit, Directive, Input, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Shared Services
import { ExchangeDataService } from '../shared/data_exchange.service';
import { InternalOrderService } from '../shared/internal_orders.service';
import { ModalService } from '../shared/modal.service';

// Shared Widgets
// import { ProgressSpinner } from '../shared/spinner/spinner.component';

// Components
import { InputItemsComponent } from './input-items/input-items.component';

// Templates & CSS
import formComponentHtml from './form.component.html';
import formComponentCss  from './form.component.css';

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

// Structures and models
import { SelectOptions } from '../models/select_options';
import { InternalOrderModel } from '../models/internal_order';
import { EventsModel } from '../models/events';
import { EntityModel } from '../models/entity';

// HTTP options for calling API
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // 'Accept': 'text/plain; application/json; text/html;',
  })
};

@Component({
  selector: 'wr-form',
  template: formComponentHtml,
  styles:   [formComponentCss.toString()],
  host: {
    class: 'wrapper'
  },
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class WRFormComponent {

  // Input Parameters
  @Input() orderId: number;      // (null): new WR / (id):WR to edit
  @Input() customerOrderForm: FormGroup; // customer order form data

  // Select-Options for fields
  companyOptions: SelectOptions[];
  customerOptions: SelectOptions[];

  // Other fields
  showFromEntityDropDown = false;
  showToEntityDropDown   = false;
  spinnerColor: string = 'warn';
  spinnerMode:  string = 'indeterminate';
  spinnerValue: number = 70;

   // Customer Order Types Options
  ordersTypeOptions: SelectOptions[] =
    [
         { id: 'P', name: 'PickUp by Company' },
         { id: 'I', name: 'PickUp by Client' },
         { id: 'D', name: 'Delivery by Company' },
         { id: 'E', name: 'Delivery by Client' },
         { id: 'R', name: 'Replacement' }
    ];

   // Order Status Options
  statusOptions: SelectOptions[] =
    [
         { id: 'P', name: 'Pending' },
         { id: 'C', name: 'Confirmed' },
         { id: 'F', name: 'Finished' },
         { id: 'A', name: 'Cancelled' }
    ];

   // Shipment Method
  shipmentOptions: SelectOptions[] =
    [
         { id: 'A', name: 'Air' },
         { id: 'G', name: 'Ground' },
         { id: 'S', name: 'Sea' },
    ];

  // Instantiate FORM data
  private formData: FormGroup;
  private itemFormData: FormGroup;

  constructor(
    private fb:            FormBuilder,
    private http:          HttpClient,
    private dataExchg:     ExchangeDataService,
    private internalOrder: InternalOrderService,
    private modalService:  ModalService,
  ) { }

  ngOnInit() {

    // Get Customer Options
    this.http.get<SelectOptions[]>('/api/entities/type/cus.json')
      .subscribe(data => {
        this.customerOptions = data.map(row => {
          return row;
        });
      });

    // Input Items FORM
    this.itemFormData = this.fb.group({
      typeItem: ['itemDeco'],
      itemId: [''],
      partNumber: [''],
      serialNumber: [''],
      condition: ['']
    });

    // FORM data
    if (this.orderId != null) {
      // Read existing order
      this.internalOrder.findWROrder(this.orderId)
        .subscribe(
          data => {
            // Set the form data with the internal order data
            this.formData = this.editFormData(data);
          }
        );
    } else {
      // Blank Order (new)
      this.formData = this.newFormData();
    }
  }

  ngAfterContentInit() {

    console.log('*** CustomerOrder From: ', this.customerOrderForm);
    console.log('*** OrderId: ', this.orderId);
    console.log('*** WRForm: ', this.formData);
  }

  // Creates a empty FormGroup with the data form the customer order
  newFormData(): FormGroup {
    return this.fb.group({

      // MODE
      mode: 'INSERT',
      // General Data
      customerId:      [this.customerOrderForm.value.blkGeneral.customerId],
      customerOrderId: [this.customerOrderForm.value.blkGeneral.orderId],
      companyId:       [this.customerOrderForm.value.blkGeneral.companyId],
      orderNo:         [{ value: 'NEW', disabled: true }],
      orderId:         ['NEW'],
      orderDate:       [(new Date()).toJSON().substring(0, 10), [<any>Validators.required]],
      observations:    [''],
      orderType:       [this.customerOrderForm.value.blkGeneral.orderType],
      orderStatus:     ['P'],
      shipmentMethod:  [this.customerOrderForm.value.blkGeneral.shipmentMethod],
      eta:             [''],
      deliveryDate:    [''],
      pieces:          [0],
      // FROM data
      fromEntity:    [this.customerOrderForm.value.blkFrom.fromEntity],
      fromAddress1:  [this.customerOrderForm.value.blkFrom.fromAddress1],
      fromAddress2:  [this.customerOrderForm.value.blkFrom.fromAddress2],
      fromCity:      [this.customerOrderForm.value.blkFrom.fromCity],
      fromZipcode:   [this.customerOrderForm.value.blkFrom.fromZipcode],
      fromState:     [this.customerOrderForm.value.blkFrom.fromState],
      fromCountryId: [this.customerOrderForm.value.blkFrom.fromCountryId],
      fromContact:   [this.customerOrderForm.value.blkFrom.fromContact],
      fromEmail:     [this.customerOrderForm.value.blkFrom.fromEmail],
      fromTel:       [this.customerOrderForm.value.blkFrom.fromTel],
      // TO data
      toEntity:    [''],
      toAddress1:  [''],
      toAddress2:  [''],
      toCity:      [''],
      toZipcode:   [''],
      toState:     [''],
      toCountryId: ['ARG'],
      toContact:   [''],
      toEmail:     [''],
      toTel:       [''],
      // GROUND data
      groundEntity:        [''],
      groundBookingNo:     [''],
      groundDepartureCity: [''],
      groundDepartureDate: [''],
      groundArrivalCity:   [''],
      groundArrivalDate:   [''],
      // AIR data
      airEntity:        [''],
      airWaybillNo:     [''],
      airDepartureCity: [''],
      airDepartureDate: [''],
      airArrivalCity:   [''],
      airArrivalDate:   [''],
      // SEA data
      seaEntity:        [''],
      seaBillLandingNo: [''],
      seaBookingNo:     [''],
      seaContainersNo:  [''],
      seaDepartureCity: [''],
      seaDepartureDate: [''],
      seaArrivalCity:   [''],
      seaArrivalDate:   [''],

    });
  }

  // Creates a FormGroup using the data of an order
  editFormData(data: any): FormGroup {
    return this.fb.group({

      // MODE
      mode: 'QUERY',
      // General Data
      customerId:      [data.customerId],
      customerOrderId: [data.orderId],
      companyId:       [data.companyId],
      orderNo:         [{ value: data.orderNo, disabled: true }],
      orderId:         [data.orderId],
      orderDate:       [data.orderDate, [<any>Validators.required]],
      observations:    [data.observations],
      orderType:       [data.orderType],
      orderStatus:     [data.orderStatus],
      shipmentMethod:  [data.shipmentMethod],
      eta:             [data.eta],
      deliveryDate:    [data.deliveryDate],
      pieces:          [data.pieces],
      // FROM data
      fromEntity:    [data.fromEntity],
      fromAddress1:  [data.fromAddress1],
      fromAddress2:  [data.fromAddress2],
      fromCity:      [data.fromCity],
      fromZipcode:   [data.fromZipcode],
      fromState:     [data.fromState],
      fromCountryId: [data.fromCountryId],
      fromContact:   [data.fromContact],
      fromEmail:     [data.fromEmail],
      fromTel:       [data.fromTel],
      // TO data
      toEntity:    [data.toEntity],
      toAddress1:  [data.toAddress1],
      toAddress2:  [data.toAddress2],
      toCity:      [data.toCity],
      toZipcode:   [data.toZipcode],
      toState:     [data.toState],
      toCountryId: [data.toCountryId],
      toContact:   [data.toContact],
      toEmail:     [data.toContact],
      toTel:       [data.toTel],
      // GROUND data
      groundEntity:        [data.groundEntity],
      groundBookingNo:     [data.groundBookingNo],
      groundDepartureCity: [data.groundDepartureCity],
      groundDepartureDate: [data.groundDepartureDate],
      groundArrivalCity:   [data.groundArrivalCity],
      groundArrivalDate:   [data.groundArrivalDate],
      // AIR data
      airEntity:        [data.airEntity],
      airWaybillNo:     [data.airWaybillNo],
      airDepartureCity: [data.airDepartureCity],
      airDepartureDate: [data.airDepartureDate],
      airArrivalCity:   [data.airArrivalCity],
      airArrivalDate:   [data.airArrivalDate],
      // SEA data
      seaEntity:        [data.seaEntity],
      seaBillLandingNo: [data.seaBillLandingNo],
      seaBookingNo:     [data.seaBookingNo],
      seaContainersNo:  [data.seaContainersNo],
      seaDepartureCity: [data.seaDepartureCity],
      seaDepartureDate: [data.seaDepartureDate],
      seaArrivalCity:   [data.seaArrivalCity],
      seaArrivalDate:   [data.seaArrivalDate]
    });
  }

  openDropDown(option) {
    if (option === 'from') {
      this.showFromEntityDropDown = !this.showFromEntityDropDown;
    } else {
      this.showToEntityDropDown   = !this.showToEntityDropDown;
    }
  }

  // Validation for item blkGeneral.customerID
  validateCustomerId(control: FormControl): {[s: string]: boolean} {

    // Depending on the customer, set the customer order's company
    if (control.value !== '') {
      // Find the company Id that this customer belongs to
      this.http.get<EntityModel>(`/api/entities/${control.value}.json`)
        .subscribe(data => {
          if (data) {
            this.formData.get('blkGeneral').get('companyId').setValue(data.companyId);
          }
        });
    }
    return null;  // null means NO errors
  }

  // Save the Order to the DBase
  saveOrder(orderId) {

    // Clear message
    this.dataExchg.changeFormMessage('');

    // Save form data
    const vformData = this.formData.value;
    // Map data before send
    const wrOrder = {
      customerId:      vformData.customerId,
      companyId:       vformData.companyId,
      customerOrderId: vformData.customerOrderId,
      orderNo:         vformData.orderNo,
      orderDate:       vformData.orderDate,
      observations:    vformData.observations,
      orderType:       vformData.orderType,
      orderStatus:     vformData.orderStatus,
      shipmentMethod:  vformData.shipmentMethod,
      eta:             vformData.eta,
      deliveryDate:    vformData.deliveryDate,
      // FROM
      fromEntity:      vformData.fromEntity,
      fromAddress1:    vformData.fromAddress1,
      fromAddress2:    vformData.fromAddress2,
      fromCity:        vformData.fromCity,
      fromZipcode:     vformData.fromZipcode,
      fromState:       vformData.fromState,
      fromCountryId:   vformData.fromCountryId,
      // TO
      toEntity:        vformData.toEntity,
      toAddress1:      vformData.toAddress1,
      toAddress2:      vformData.toAddress2,
      toCity:          vformData.toCity,
      toZipcode:       vformData.toZipcode,
      toState:         vformData.toState,
      toCountryId:     vformData.toCountryId,
      // GROUND
      groundEntity:        vformData.groundEntity,
      groundBookingNo:     vformData.groundBookingNo,
      groundDepartureCity: vformData.groundDepartureCity,
      groundDepartureDate: vformData.groundDepartureDate,
      groundArrivalCity:   vformData.groundArrivalCity,
      groundArrivalDate:   vformData.groundArrivalDate,
      // AIR
      airEntity:        vformData.airEntity,
      airWaybillNo:     vformData.airWaybillNo,
      airDepartureCity: vformData.airDepartureCity,
      airDepartureDate: vformData.airDepartureDate,
      airArrivalCity:   vformData.airArrivalCity,
      airArrivalDate:   vformData.airArrivalDate,
      // SEA
      seaEntity:        vformData.seaEntity,
      seaBiiLandingNo:  vformData.seaBillLandingNo,
      seaBookingNo:     vformData.seaBookingNo,
      seaContainersNo:  vformData.seaContainersNo,
      seaDepartureCity: vformData.seaDepartureCity,
      seaDepartureDate: vformData.seaDepartureDate,
      seaArrivalCity:   vformData.seaArrivalCity,
      seaArrivalDate:   vformData.seaArrivalDate,
    };

    if (this.formData.invalid) {

      this.dataExchg.changeFormMessage('TRK-0002(E): the form is invalid. Please check required fields and retry.');

    } else {

      if (this.formData.value.mode === 'INSERT') {

        /*
           INSERT new Order into the DBase
        */
        // Add the new customer order in the DBase
        this.http.post('/api/warehouse_receipts.json', wrOrder, httpOptions)
          .subscribe(
            data => {
              this.dataExchg.changeFormMessage(data['message']);
              setTimeout(() => { this.dataExchg.changeFormMessage(''); }, 10000);   // delete the message after 10 secs.
              // Set the form in QUERY mode
              this.formData.get('mode').setValue('QUERY');
              // Write some data
              this.formData.get('orderNo').setValue(data['orderNo']);
              this.formData.get('orderId').setValue(data['orderId']);
              this.orderId = data['orderId'];
            },
            error => {
              this.dataExchg.changeFormMessage(`TRK-0003(E): ${error['message']} // ${error['extraMsg']}`);
            }
          );

      } else {

        /*
           UPDATE a existing Order to the DBase
        */
        // Add the new customer order in the DBase
        this.http.patch(`/api/warehouse_receipts/${orderId}.json`, wrOrder, httpOptions)
          .subscribe(
            data => {
              // Set the form in QUERY mode
              this.formData.get('mode').setValue('QUERY');
              this.dataExchg.changeFormMessage(data['message']);
              setTimeout(() => { this.dataExchg.changeFormMessage(''); }, 10000);   // delete the message after 10 secs.
            },
            error => {
              this.dataExchg.changeFormMessage(`TRK-0003(E): ${error['message']}  // ${error['extraMsg']}`);
            }
          );
      }

    }

  }

  // Load Items to the WR
  loadItems(orderId) {

    let inputs = {
      orderId: orderId,
      itemFormData: this.itemFormData
    }
    this.modalService.init(InputItemsComponent, inputs, {});
  }
}

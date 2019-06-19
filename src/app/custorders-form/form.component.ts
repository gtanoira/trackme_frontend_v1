import { Component, OnInit, Directive, Input, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// Services
import { ExchangeDataService } from '../shared/data_exchange.service';
import { CustomerOrderService } from '../shared/customer_orders.service';

// Templates & CSS
import formComponentHtml from './form.component.html';
import formComponentCss    from './form.component.css';

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
import { CustomerOrderModel } from '../models/customer_order';
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
  selector: 'app-form',
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

export class CustomerOrderFormComponent {

  // Input Parameters
  @Input() orderId: number;     // Order no.: (null): new order / (id):order to edit

  // Select-Options for fields
  companyOptions: SelectOptions[];
  customerOptions: SelectOptions[];
  // Other fields
  formMessage: string = '';
  showFromEntityDropDown = false;
  showToEntityDropDown   = false;

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

   // Incoterm Options
  incotermOptions: SelectOptions[] =
    [
         { id: '   ', name: '' },
         { id: 'EXW', name: 'EXW - Ex Works' },
         { id: 'FCA', name: 'FCA - Free Carrier' },
         { id: 'FAS', name: 'FAS - Free Alongside Ship' },
         { id: 'FOB', name: 'FOB - Free On Board' },
         { id: 'CPT', name: 'CPT - Carriage Paid To' },
         { id: 'CFR', name: 'CFR - Cost and Freight' },
         { id: 'CIF', name: 'CIF - Cost, Insurance and Freight' },
         { id: 'CIP', name: 'CIP - Carriage and Insurance Paid to' },
         { id: 'DAT', name: 'DAT - Delivered At Terminal' },
         { id: 'DAP', name: 'DAP - Delivered At Place' },
         { id: 'DDU', name: 'DDU - Delivered Duty Unpaid' },
         { id: 'DDP', name: 'DDP - Delivered Duty Paid' },
    ];

  // Instantiate FORM data
  private formData: FormGroup;

  constructor(private fb:            FormBuilder,
              private http:          HttpClient,
              private dataExchg:     ExchangeDataService,
              private customerOrder: CustomerOrderService) {
    // Blank Order (new)
    this.formData = this.newFormData();
  }

  ngOnInit() {

    // FORM data
    if (this.orderId != null) {
      // Read existing order
      this.customerOrder.findCustomerOrder(this.orderId)
        .subscribe(
          data => {
            // Set the form data with the order
            this.formData = this.editFormData(data);
          }
        );
    }

    // Form Message service
    this.dataExchg.formCurrentMessage
      .subscribe(message => this.formMessage = message);

    // Get Customer Options
    this.http.get<SelectOptions[]>('/api/entities/type/cus.json')
      .subscribe(data => {
        this.customerOptions = data.map(row => {
          return row;
        });
      });
  }

  ngAfterContentInit() {
    if (this.orderId != null) {
      this.formData.get('blkGeneral').get('customerId').disable();
      this.formData.get('blkGeneral').get('companyId').disable();
    }
  }

  // Creates a empty FormGroup
  newFormData(): FormGroup {
    return this.fb.group({

      /**
          Form Properties (mode property)
          ='INSERT': the record is new and is NOT stored in the DBase
          ='QUERY':  the record has been read from the DBase but was NOT modified
          ='UPDATE': the record has been read from the DBase and WAS modified
      **/
      formProperties: {
        mode: 'INSERT'
      },

      // General BLOCK
      blkGeneral: this.fb.group({
        companyId: [1, [<any>Validators.required]],
        orderNo: ['NEW'],
        orderId: ['NEW'],
        custRef: [''],
        orderType: ['P'],
        customerId: ['', [<any>Validators.required, this.validateCustomerId.bind(this)]],
        applicantName: [''],
        orderDate: [(new Date()).toJSON().substring(0, 10), [<any>Validators.required]],
        orderStatus: ['P'],
        incoterm: ['FOB'],
        shipmentMethod: ['A'],
        observations: [''],
        pieces: [0],
        eta: [''],
        deliveryDate: [''],
        thirdPartyId: ['', [<any>Validators.required]],
        eventsScope: ['G']
      }),

      // Block FROM
      blkFrom: this.fb.group({
        fromEntity: [''],
        fromAddress1: [''],
        fromAddress2: [''],
        fromCity: [''],
        fromZipcode: [''],
        fromState: [''],
        fromCountryId: ['ARG'],
        fromContact:[''],
        fromEmail: [''],
        fromTel: ['']
      }),

      // Block TO
      blkTo: this.fb.group({
        toEntity: ['', Validators.required],
        toAddress1: [''],
        toAddress2: [''],
        toCity: [''],
        toZipcode: [''],
        toState: [''],
        toCountryId: ['ARG'],
        toContact:[''],
        toEmail: [''],
        toTel: ['']
      }),

    });
  }

  // Creates a FormGroup using the data of an order
  editFormData(data: any): FormGroup {
    return this.fb.group({

      // Form Properties
      formProperties: this.fb.group({
        mode: 'QUERY'
      }),

      // General BLOCK
      blkGeneral: this.fb.group({
        companyId: [data.companyId],
        orderNo: [data.orderNo],
        orderId: [data.orderId],
        custRef: [data.custRef],
        orderType: [data.orderType],
        customerId: [data.customerId],
        applicantName: [data.applicantName],
        orderDate: [data.orderDate, Validators.required],
        orderStatus: [data.orderStatus],
        incoterm: [data.incoterm],
        shipmentMethod: [data.shipmentMethod],
        observations: [data.observations],
        pieces: [data.pieces],
        eta: [data.eta],
        deliveryDate: [data.deliveryDate],
        thirdPartyId: [data.thirdPartyId, Validators.required],
        eventsScope: [data.eventsScope]
      }),

      // Block FROM
      blkFrom: this.fb.group({
        fromEntity: [data.fromEntity],
        fromAddress1: [data.fromAddress1],
        fromAddress2: [data.fromAddress2],
        fromCity: [data.fromCity],
        fromZipcode: [data.fromZipcode],
        fromState: [data.fromState],
        fromCountryId: [data.fromCountryId],
        fromContact:[data.fromContact],
        fromEmail: [data.fromEmail],
        fromTel: [data.fromTel]
      }),

      // Block TO
      blkTo: this.fb.group({
        toEntity: [data.toEntity, Validators.required],
        toAddress1: [data.toAddress1],
        toAddress2: [data.toAddress2],
        toCity: [data.toCity],
        toZipcode: [data.toZipcode],
        toState: [data.toState],
        toCountryId: [data.toCountryId],
        toContact:[data.toContact],
        toEmail: [data.toEmail],
        toTel: [data.toTel]
      }),
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

    // Set the customer order's company based on the customer
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
    this.formMessage = '';

    // Save form data
    const vformData = this.formData.value;
    // Map data before send
    const customerOrder = {
      companyId:     vformData.blkGeneral.companyId,
      customerId:    vformData.blkGeneral.customerId,
      orderNo:       vformData.blkGeneral.orderNo,
      orderId:       vformData.blkGeneral.orderId,
      orderDate:     vformData.blkGeneral.orderDate,
      observations:  vformData.blkGeneral.observations,
      custRef:       vformData.blkGeneral.custRef,
      orderType:     vformData.blkGeneral.orderType,
      orderStatus:   vformData.blkGeneral.orderStatus,
      applicantName: vformData.blkGeneral.applicantName,
      oldOrderNo:    vformData.blkGeneral.oldOrderNo,
      incoterm:      vformData.blkGeneral.incoterm,
      shipmentMethod: vformData.blkGeneral.shipmentMethod,
      eta:           vformData.blkGeneral.eta,
      deliveryDate:  vformData.blkGeneral.deliveryDate,
      eventsScope:   vformData.blkGeneral.eventsScope,
      thirdPartyId:  vformData.blkGeneral.thirdPartyId,
      fromEntity:    vformData.blkFrom.fromEntity,
      fromAddress1:  vformData.blkFrom.fromAddress1,
      fromAddress2:  vformData.blkFrom.fromAddress2,
      fromCity:      vformData.blkFrom.fromCity,
      fromZipcode:   vformData.blkFrom.fromZipcode,
      fromState:     vformData.blkFrom.fromState,
      fromCountryId: vformData.blkFrom.fromCountryId,
      toEntity:      vformData.blkTo.toEntity,
      toAddress1:    vformData.blkTo.toAddress1,
      toAddress2:    vformData.blkTo.toAddress2,
      toCity:        vformData.blkTo.toCity,
      toZipcode:     vformData.blkTo.toZipcode,
      toState:       vformData.blkTo.toState,
      toCountryId:   vformData.blkTo.toCountryId
    };

    if (this.formData.invalid) {

      this.formMessage = 'TRK-0002(E): the form is invalid. Please check required fields and retry.';

    } else {

      if (vformData.formProperties.mode === 'INSERT') {

        /*
           INSERT new Order into the DBase
        */
        // Add the new customer order in the DBase
        this.http.post('/api/customer_orders.json', customerOrder, httpOptions)
          .subscribe(
            data => {
              this.formMessage = data['message'];
              setTimeout(() => { this.formMessage = ''; }, 10000);   // delete the message after 10 secs.
              // Re-set the order to QUERY modality
              this.formData.value.formProperties.mode = 'QUERY';
              this.formData.get('blkGeneral').get('customerId').disable();
              this.formData.value.blkGeneral.customerId = vformData.blkGeneral.customerId;
              this.formData.get('blkGeneral').get('companyId').disable();
              this.formData.value.blkGeneral.companyId = vformData.blkGeneral.companyId;
              this.formData.get('blkGeneral').get('orderNo').setValue(data['orderNo']);
              this.formData.get('blkGeneral').get('orderId').setValue(data['orderId']);
              this.orderId = data['orderId'];
            },
            error => {
              this.formMessage = `TRK-0003(E): ${error['message']} // ${error['extraMsg']}`;
            }
          );

      } else {

        /*
           UPDATE a existing Order to the DBase
        */
        // Add the new customer order in the DBase
        this.http.patch(`/api/customer_orders/${orderId}.json`, customerOrder, httpOptions)
          .subscribe(
            data => {
              this.formMessage = data['message'];
              setTimeout(() => { this.formMessage = ''; }, 10000);   // delete the message after 10 secs.
            },
            error => {
              this.formMessage = `TRK-0003(E): ${error['message']}  // ${error['extraMsg']}`;
            }
          );
      }

    }

  }

}

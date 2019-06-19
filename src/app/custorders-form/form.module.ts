import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DynamicModule } from 'ng-dynamic-component';
import { AgGridModule } from 'ag-grid-angular';

import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule }      from '@angular/material/radio';

// Customer Order Components
import { CustomerOrderFormComponent } from './form.component';
import { CustomerOrderTabs } from './form_tabs/tabs.component';
import { CustomerEventsComponent } from './events/events.component';

// Other Modules
import { WRFormModule } from '../wr-form/form.module';

// Shared Services
import { ExchangeDataService } from '../shared/data_exchange.service';
import { OrderEventsService } from '../shared/order_events.service';
import { CustomerOrderService } from '../shared/customer_orders.service';
import { DomService } from '../shared/dom.service';
import { ModalService } from '../shared/modal.service';

// Shared Widgets
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AgGridModule.withComponents([SharedModule]),
    BrowserModule,
    BrowserAnimationsModule,
    DynamicModule.withComponents([WRFormModule]),
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    HttpClientModule,
    ReactiveFormsModule,
    WRFormModule,
    SharedModule,
  ],
  declarations: [
    //  Private or Local Components
    CustomerOrderFormComponent,
    CustomerOrderTabs,
    CustomerEventsComponent,
    // Shared Components
  ],
  providers: [
    CustomerOrderService,
    DomService,
    ExchangeDataService,
    HttpClientModule,
    ModalService,
    OrderEventsService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-SP' },
    SharedModule,
  ],
  bootstrap: [
    CustomerOrderFormComponent
  ]
})

export class CustomerOrderFormModule {
}

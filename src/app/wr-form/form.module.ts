import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
  MatSelectModule,
  MatProgressSpinnerModule,
  MatTabsModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule }      from '@angular/material/radio';

// Private or Local Components
import { WRFormComponent } from './form.component';
import { ItemsComponent } from './items/items.component';
import { InputItemsComponent } from './input-items/input-items.component';

// Shared Services
import { ExchangeDataService } from '../shared/data_exchange.service';
import { OrderEventsService } from '../shared/order_events.service';
import { InternalOrderService } from '../shared/internal_orders.service';
import { ItemsService } from '../shared/items.service';

// Shared Widgets

@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    BrowserModule,
    BrowserAnimationsModule,
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
    // SharedModule,
  ],
  declarations: [
    // Private Components
    ItemsComponent,
    InputItemsComponent,
    WRFormComponent,
  ],
  providers: [
    ExchangeDataService,
    HttpClientModule,
    InternalOrderService,
    ItemsService,
    OrderEventsService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-SP' }
  ],
  bootstrap: [
    WRFormComponent
  ],
  entryComponents: [
    InputItemsComponent,
  ]
})

export class WRFormModule {
}

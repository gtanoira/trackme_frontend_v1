import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';

// External Libraries
import { DynamicModule } from 'ng-dynamic-component';

// Shared Services
import { AuthenticationService } from '../shared/authentication.service';
import { ErrorMessageService } from '../shared/error-message.service';
import { OnlyNumbersDirective, ToUppercaseDirective, NumberFormatterDirective } from '../shared/formatter.directives';

// Interceptors
// import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AuthInterceptor } from './_helpers/auth.interceptor';

// Componentes
import { AppComponent } from './app.component';
import { routing } from './app.routing';
// Authentication & Authorization
import { LoginComponent } from './login/login.component';
import { MenuppalComponent } from './menuppal/menuppal.component';
// Customer Orders Components & Services
import { CustomerOrdersTabsComponent } from './customer_orders/customer_orders_tabs.component';
import { COrdersGridComponent } from './customer_orders/grid/grid.component';
import { CustomerOrdersService } from '../shared/customer_orders.service';

@NgModule({
  declarations: [
    AppComponent,
    NumberFormatterDirective,
    OnlyNumbersDirective,
    ToUppercaseDirective,
    // Authentication & Authorization
    LoginComponent,
    MenuppalComponent,
    // Customer Orders
    CustomerOrdersTabsComponent,
    COrdersGridComponent
  ],
  imports: [
    AgGridModule.withComponents([]),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    routing,
    // Customer Orders
    DynamicModule.withComponents([CustomerOrdersTabsComponent, COrdersGridComponent])
  ],
  exports: [
    OnlyNumbersDirective,
  ],
  providers: [
    AuthenticationService,
    CustomerOrdersService,
    ErrorMessageService,
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE,
      useValue: 'es-SP'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

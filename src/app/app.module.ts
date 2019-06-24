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

// Shared Services
import { AuthenticationService } from '../shared/authentication.service';
import { ErrorMessageService } from '../shared/error-message.service';
import { OnlyNumbersDirective, ToUppercaseDirective, NumberFormatterDirective } from '../shared/formatter.directives';

// Interceptors
// import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AuthInterceptor } from './_helpers/auth.interceptor';

// Componentes
import { AppComponent } from './app.component';
import { CustomerOrdersGridComponent } from './customer_orders/customer_orders_grid.component';
import { LoginComponent } from './login/login.component';
import { MenuppalComponent } from './menuppal/menuppal.component';
import { routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    CustomerOrdersGridComponent,
    LoginComponent,
    MenuppalComponent,
    NumberFormatterDirective,
    OnlyNumbersDirective,
    ToUppercaseDirective,
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
  ],
  exports: [
    OnlyNumbersDirective,
  ],
  providers: [
    AuthenticationService,
    ErrorMessageService,
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE,
      useValue: 'es-SP'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

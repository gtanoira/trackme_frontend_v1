import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatButtonModule, MatTabsModule } from '@angular/material';
import { DynamicModule } from 'ng-dynamic-component';
import { TabGroup }     from './tab-group.component';

// TrackMe modules
import { AppModule } from '../grid/app.module';
import { CustomerOrderFormModule } from '../custorders-form/form.module';

// Shared Modules
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    // TrackMe modules
    AppModule,
    CustomerOrderFormModule,
    // Other modules
    BrowserModule,
    DynamicModule.withComponents([AppModule, CustomerOrderFormModule]),
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    NoopAnimationsModule,
    SharedModule,
  ],
  declarations: [
    TabGroup
  ],
  bootstrap: [
    TabGroup
  ],
  entryComponents: [
    TabGroup
  ],
})
export class AppTabsModule {
}

platformBrowserDynamic().bootstrapModule(AppTabsModule);

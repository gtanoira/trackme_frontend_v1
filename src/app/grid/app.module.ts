import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TabGroup } from '../app-tabs/tab-group.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    FormsModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [HttpClientModule, TabGroup],
  bootstrap: [AppComponent]
})
export class AppModule {
}

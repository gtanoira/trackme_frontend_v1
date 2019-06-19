import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Shared Components
import { ProgressSpinner } from './spinner/spinner.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    ProgressSpinner,
  ],
  exports: [
    ProgressSpinner,
  ]
})
export class SharedModule { }

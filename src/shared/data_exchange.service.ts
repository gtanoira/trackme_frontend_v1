// This components is for exchange data through NON-RELATED components
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Injectable()
export class ExchangeDataService {

  // FORM messages
  private formMessageSubject = new BehaviorSubject('');
  formCurrentMessage = this.formMessageSubject.asObservable();

  constructor() { }

  changeFormMessage(message: string) {
    this.formMessageSubject.next(message);
  }

}

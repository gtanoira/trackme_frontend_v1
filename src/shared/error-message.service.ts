// This components is for print error messages on the screen
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ErrorMessageService {

  // FORM messages
  private formMessageSubject = new BehaviorSubject('');
  formCurrentMessage = this.formMessageSubject.asObservable();

  constructor() { }

  changeErrorMessage(message: string) {
    this.formMessageSubject.next(message);
  }

}
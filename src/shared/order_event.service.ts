import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Class Models
import { EventModel } from '../models/event.model';

@Injectable()
export class OrderEventService {

  data: any;

  constructor(
    private http: HttpClient
  ) {}

  getEventsFromCustomerOrder(customerOrderId: number):  Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`/api/v1/customer_orders/${(customerOrderId == null) ? 0 : customerOrderId}/events.json`);
  }
}

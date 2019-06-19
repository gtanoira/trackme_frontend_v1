import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Class Models
import { EventsModel } from '../models/events';

@Injectable()
export class OrderEventsService {

  data: any;

  constructor(private http:HttpClient) {
  }

  findCustomerOrderEvents(orderId: number):  Observable<EventsModel[]> {

    return this.http.get<EventsModel[]>(`/api/customer_orders/${(orderId == null) ? 0 : orderId}/events.json`);

  }
}

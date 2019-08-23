import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { EventModel } from '../models/event.model';

@Injectable()
export class OrderEventService {

  data: any;

  constructor(
    private http: HttpClient
  ) {}

  getEventsFromCustomerOrder(customerOrderId: number):  Observable<EventModel[]> {
    return this.http.get<EventModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/customer_orders/${(customerOrderId == null) ? 0 : customerOrderId}/events.json`
    );
  }
}

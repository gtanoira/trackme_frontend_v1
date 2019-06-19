import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

// Class Models
import { CustomerOrderModel }  from '../models/customer_order';

@Injectable()
export class CustomerOrderService {

  data: any;

  constructor(private http: HttpClient) {
  }

  // Read the customer order data by record id
  findCustomerOrder(orderId: number):  Observable<CustomerOrderModel> {

    return this.http.get<CustomerOrderModel>(`/api/customer_orders/${(orderId == null) ? 0 : orderId}.json`);

  }

}

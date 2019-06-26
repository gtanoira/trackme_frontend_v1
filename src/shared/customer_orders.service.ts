import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { CustomerOrdersModel }  from '../models/customer_orders.model';

@Injectable()
export class CustomerOrdersService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all customer orders
  getAllCustomerOrders():  Observable<CustomerOrdersModel[]> {
    return this.http.get<CustomerOrdersModel[]>(
      `${environment.envData.loginServer}/api/v1/customer_orders.json`
    );
  }

  // Read a customer order by orderId
  getCustomerOrderByOrderid(orderId: number):  Observable<CustomerOrdersModel> {
    return this.http.get<CustomerOrdersModel>(
      `${environment.envData.loginServer}/api/v1/customer_orders/${(orderId == null) ? 0 : orderId}.json`
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { CustomerOrderModel } from '../models/customer_order.model';

@Injectable()
export class CustomerOrderService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all customer orders
  getAllCustomerOrders():  Observable<CustomerOrderModel[]> {
    return this.http.get<CustomerOrderModel[]>(
      `${environment.envData.loginServer}/api/v1/customer_orders.json`
    );
  }

  // Get one customer order by orderId
  getCustomerOrderByOrderid(orderId: number):  Observable<CustomerOrderModel> {
    return this.http.get<CustomerOrderModel>(
      `${environment.envData.loginServer}/api/v1/customer_orders/${(orderId == null) ? 0 : orderId}.json`
    );
  }

}

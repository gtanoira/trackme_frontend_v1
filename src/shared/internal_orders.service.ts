import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Class Models
import { InternalOrderModel }  from '../models/internal_order';

@Injectable()
export class InternalOrderService {

  data: any;

  constructor(private http: HttpClient) {
  }

  // Read the customer order data by record id
  findWROrder(orderId: number):  Observable<InternalOrderModel> {

    return this.http.get<InternalOrderModel>(`/api/warehouse_receipts/${(orderId == null) ? 0 : orderId}.json`);

  }

}

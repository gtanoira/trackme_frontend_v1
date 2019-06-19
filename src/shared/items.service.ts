import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Class Models
import { ItemsModel }  from '../models/items';

@Injectable()
export class ItemsService {

  data: any;

  constructor(private http: HttpClient) {
  }

  // Read the customer order data by record id
  findInternalOrderItems(orderId: number):  Observable<ItemsModel[]> {

    return this.http.get<ItemsModel[]>(`/api/internal_orders/${(orderId == null) ? 0 : orderId}/items.json`);

  }

}

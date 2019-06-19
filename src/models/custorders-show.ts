// Models defined for Database Tables

// Table: customer_orders
export interface CustordersShowModel {
  id: number;
  name: string;
  orderNo: number;
  oldOrderNo: string;
  orderDate: string;
  toEntity: string;
}

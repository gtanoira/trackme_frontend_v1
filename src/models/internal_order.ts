// Models defined for Database Tables

// Table: customer_orders
export interface InternalOrderModel {
  customerId: number;
  companyId: number;
  customerOrderId: number;
  orderNo: number;
  orderId: number;
  orderDate: string;
  observations: string;
  orderType: string;
  orderStatus: string;
  shipmentMethod: string;
  eta: string;
  deliverDate: string;
  pieces: string;
  // FROM
  fromEntity: string;
  fromAddress1: string;
  fromAddress2: string;
  fromCity: string;
  fromZipcode: string;
  fromState: string;
  fromCountryId: string;
  // TO
  toEntity: string;
  toAddress1: string;
  toAddress2: string;
  toCity: string;
  toZipcode: string;
  toState: string;
  toCountryId: string;
  // GROUND
  groundEntity: string;
  groundBookingNo: string;
  groundDepartureCity: string;
  groundDepartureDate: string;
  groundArrivalCity: string;
  groundArrivalDate: string;
  // AIR
  airEntity: string;
  airBookingNo: string;
  airDepartureCity: string;
  airDepartureDate: string;
  airArrivalCity: string;
  airArrivalDate: string;
  // SEA
  seaEntity: string;
  seaBillLandingNo: string;
  seaContainersNo: string;
  seaBookingNo: string;
  seaDepartureCity: string;
  seaDepartureDate: string;
  seaArrivalCity: string;
  seaArrivalDate: string;
}

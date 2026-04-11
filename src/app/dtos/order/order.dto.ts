
import {Type} from "class-transformer";
import {CartItemDTO} from "./cart.item.dto";



export class OrderDTO {
  user_id: number;

  fullname: string;

  email: string;

  phone_number: string;

  address: string;

  shipping_address: string; // Added shipping_address

  note: string;

  total_money?: number;

  shipping_method: string;

  order_date?: Date;

  payment_method: string;

  status?: string; // Field to hold the order status for updates

  cart_items: { product_id: number, quantity: number }[]; // Thêm cart_items để lưu thông tin giỏ hàng

  constructor(data: any) {
    this.user_id = data.user_id;
    this.fullname = data.fullname;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.shipping_address = data.shipping_address; // Added shipping_address
    this.note = data.note;
    this.order_date = data.order_date;
    this.total_money = data.total_money;
    this.shipping_method = data.shipping_method;
    this.payment_method = data.payment_method;
    this.status = data.status; // Assign status from input data
    this.cart_items = data.cart_items;
  }
  
}

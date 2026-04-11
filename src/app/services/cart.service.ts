import { Injectable } from '@angular/core';
import {ProductService} from "./product.service";
import {ToastrService} from "ngx-toastr";
import {Product} from "../models/product";
@Injectable({
  providedIn: 'root'
})

export class CartService{
  //Dung map de luu tru gio hang
  private cart: Map<number, number> = new Map();

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    //Lay du lieu gio hang tu localStorage khi khoi tao service

    this.refreshCart();
  }

  public  refreshCart(){
    const storedCart = localStorage.getItem(this.getCartKey());
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    } else {
      this.cart = new Map<number, number>();
    }
  }

  private getCartKey():string{
    const userResponseJSON = localStorage.getItem('user');
    const userResponse = JSON.parse(userResponseJSON!);
    
    return `cart:${userResponse?.id ?? ''}`;
  }
  addToCart(productId: number, quantity: number = 1, productName?: string): void {
    if (this.cart.has(productId)) {
      // If product already exists in cart, update quantity
      const newQuantity = this.cart.get(productId)! + quantity;
      this.cart.set(productId, newQuantity);
      this.toastr.success(`Đã cập nhật số lượng ${productName || 'sản phẩm'} trong giỏ hàng`, 'Thành công!', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    } else {
      // Add new product to cart
      this.cart.set(productId, quantity);
      this.toastr.success(`Đã thêm ${productName || 'sản phẩm'} vào giỏ hàng`, 'Thành công!', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    }
    // Save cart to local storage
    this.saveCartToLocalStorage();
  }
  getCart(): Map<number, number>{
    return this.cart;
  }
  //Luu tru gio hang vao localStorage
  private saveCartToLocalStorage(): void{
    localStorage.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
  }

  setCart(cart : Map<number, number>) {
    this.cart = cart ?? new Map<number, number>();
    this.saveCartToLocalStorage();
  }

  cleanCart(): void {
    this.cart.clear();
    this.saveCartToLocalStorage();
  }
}

import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from "../../services/token.service";
import { Router } from "@angular/router";
import { Order } from "../../models/order";
import { CouponService } from '../../services/coupon.service';
import { CouponList } from '../../models/coupon';
import { PayosService } from '../../services/payos.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss', '../../styles/payos-payment.css']
})
export class OrderComponent implements OnInit {

  defaultImageUrl: string = `${environment.apiBaseUrl}/products/images/default-product-image.png`;

  // PayOS properties - đơn giản hóa
  isPaymentOpen: boolean = false;
  isCreatingPaymentLink: boolean = false;
  paymentMessage: string = '';
  currentOrderCode?: number;

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src !== this.defaultImageUrl) {
      imgElement.src = this.defaultImageUrl;
    }
  }

  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    shipping_method: 'express',
    shipping_address: '',
    payment_method: 'other',
    cart_items: []
  };
  couponDiscount: number = 0;
  couponApplied: boolean = false;
  coupons: CouponList[] = [];

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly formBuilder: FormBuilder,
    private readonly tokenService: TokenService,
    private readonly router: Router,
    private readonly couponService: CouponService,
    private readonly payosService: PayosService,
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {
    // Tạo form validation
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      shipping_method: ['express'],
      payment_method: ['other'],
      couponCode: [''],
    });
  }

  ngOnInit(): void {
    this.orderData.user_id = this.tokenService.getUserId();
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());
    this.cart = cart;

    if (productIds.length === 0) {
      this.toastr.info('Giỏ hàng trống', 'Thông báo');
      this.router.navigate(['/']);
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        // Lọc và tạo cartItems, chỉ giữ những product tồn tại
        const validCartItems = [];
        
        for (const productId of productIds) {
          const product = products.find((p) => p.id === productId);
          
          if (!product) {
            console.warn(`Product not found for ID: ${productId}, removing from cart`);
            this.cart.delete(productId);
            continue;
          }
          
          let displayImageUrl = this.defaultImageUrl;
          if (product?.product_images?.[0]?.image_url) {
            displayImageUrl = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
          } else if (product?.thumbnail) { 
            displayImageUrl = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          
          (product as any).displayImageUrl = displayImageUrl;
          
          validCartItems.push({
            product: product,
            quantity: this.cart.get(productId)!
          });
        }
        
        this.cartItems = validCartItems;
        
        // Cập nhật lại cart service với dữ liệu đã được clean
        this.cartService.setCart(this.cart);
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });

    this.loadCoupons();
  }

  loadCoupons() {
    this.couponService.getAllListCoupons().subscribe({
      next: (coupons: CouponList[]) => {
        this.coupons = coupons;
      },
      error: (error: any) => {
        console.error('Error fetching coupons:', error);
      }
    });
  }

  applyCoupon(): void {
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (couponCode) {
      this.calculateTotal();
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (response: any) => {
            if (response?.data?.result !== undefined) {
              this.couponDiscount = this.totalAmount - response.data.result;
              this.totalAmount = response.data.result;
              this.couponApplied = true;
            }
          }
        })
    }
  }

  // Đặt hàng
  placeOrder() {
    if (this.orderForm.errors == null) {
      this.orderData.user_id = this.tokenService.getUserId();
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.shipping_address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      this.orderData.cart_items = this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      const couponCode = this.orderForm.get('couponCode')!.value;
      const paymentMethod = this.orderForm.get('payment_method')!.value;

      if (couponCode) {
        this.calculateTotal();
        this.couponService.calculateCouponValue(couponCode, this.totalAmount)
          .subscribe({
            next: (response: any) => {
              this.totalAmount = response.data.result;
              this.couponApplied = true;
              this.orderData.total_money = this.totalAmount;
              
              if (paymentMethod === 'other') {
                this.sendOrderPayment();
              } else {
                this.sendOrder();
              }
            }
          })
      } else {
        this.orderData.total_money = this.totalAmount;
        
        if (paymentMethod === 'other') {
          this.sendOrderPayment();
        } else {
          this.sendOrder();
        }
      }
    } else {
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  sendOrderPayment(){
    if (this.tokenService.isTokenExpired()) {
      this.toastr.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'Lỗi');
      this.router.navigate(['/login']);
      return;
    }
    
    // Không tạo order ngay, chỉ chuyển sang payment với data
    this.processPayment();
  }

  sendOrder() {
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (response: Order) => {
        this.cartService.cleanCart();
        this.toastr.success("Đặt hàng thành công", "Thành công", {
          timeOut: 2000
        });
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        alert(`Lỗi khi đặt hàng vui lòng nhập đầy đủ thông tin`);
      },
    });
  }

  // PayOS payment methods - đơn giản hóa
  private processPayment() {
    const totalMoney = this.orderData.total_money;
    if (totalMoney !== undefined && totalMoney > 0) {
      this.createPayOSPayment(totalMoney);
    } else {
      alert('Số tiền không hợp lệ!');
    }
  }

  private createPayOSPayment(totalMoney: number) {
    this.isCreatingPaymentLink = true;
    this.currentOrderCode = Date.now();
    
    const buyerInfo = {
      fullname: this.orderData.fullname,
      email: this.orderData.email,
      phone_number: this.orderData.phone_number
    };

    this.payosService.initiatePayment(totalMoney, this.currentOrderCode, buyerInfo).subscribe({
      next: (response) => {
        console.log('=== PayOS Response Debug ===');
        console.log('Full response:', response);
        console.log('Error code:', response.error);
        console.log('Data exists:', !!response.data);
        console.log('CheckoutUrl:', response.data?.checkoutUrl);
        console.log('QR Code:', response.data?.qrCode);
        
        this.isCreatingPaymentLink = false;
        
        if (response.error === 0 && response.data?.checkoutUrl) {
          console.log('✅ Navigating to payment checkout...');
          console.log('Current Order Code:',response);
          // Chuẩn bị FULL orderData để truyền sang PaymentCheckout
          const fullOrderData = {
            ...this.orderData,
            cart_items_detail: this.cartItems.map(item => ({
              product_id: item.product.id,
              product_name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              total_money: item.product.price * item.quantity,
              thumbnail: item.product.thumbnail
            }))
          };
          
          // Chuyển hướng sang PaymentCheckout component với query params
          this.router.navigate(['/payment-checkout'], {
            queryParams: {
              checkoutUrl: response.data.checkoutUrl,
              qrCode: response.data.qrCode,
              orderCode: response.data?.orderCode,
              amount: totalMoney,
              orderData: encodeURIComponent(JSON.stringify(fullOrderData))
            }
          });
          
          console.log('✅ Navigation completed');
        } else {
          console.error('❌ PayOS response error:', response);
          this.toastr.error(`Lỗi tạo thanh toán: ${response.message}`, 'Lỗi');
        }
      },
      error: (error: any) => {
        this.isCreatingPaymentLink = false;
        console.error('PayOS payment error:', error);
        this.toastr.error(`Lỗi khi khởi tạo thanh toán: ${error.message || error}`, 'Lỗi');
      }
    });
  }



  closePayment() {
    this.payosService.hidePayment('embedded-payment-container');
    this.isPaymentOpen = false;
    this.currentOrderCode = undefined;
  }

  // Debug method để test PayOS
  testPayOSDisplay() {
    console.log('=== Testing PayOS Display ===');
    const testCheckoutUrl = 'https://pay.payos.vn/web/6734b0eb87fb32eba7a93fc4';
    this.payosService.showPaymentQR(testCheckoutUrl, 'embedded-payment-container');
    this.isPaymentOpen = true;
    console.log('Test PayOS display called');
  }

  // Utility methods
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      // Sử dụng optional chaining để tránh lỗi
      if (item?.product?.price && item.quantity) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCartFromCartItems();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.updateCartFromCartItems();
  }

  removeFromCart(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      const productId = this.cartItems[index].product.id;
      
      // Xóa khỏi cartItems array
      this.cartItems.splice(index, 1);
      
      // Xóa khỏi cart map
      this.cart.delete(productId);
      
      // Cập nhật cart service
      this.cartService.setCart(this.cart);
      
      // Tính lại tổng tiền
      this.calculateTotal();
      
      // Hiển thị thông báo
      this.toastr.info('Đã xóa sản phẩm khỏi giỏ hàng', 'Thông báo');
      
      // Nếu giỏ hàng trống, chuyển về trang chủ
      if (this.cartItems.length === 0) {
        this.toastr.info('Giỏ hàng trống', 'Thông báo');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      }
    }
  }

  updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach(item => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
    this.calculateTotal();
  }
}
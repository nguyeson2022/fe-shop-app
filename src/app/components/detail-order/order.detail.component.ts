import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';

// Components
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ContactComponent } from '../contact/contact.component';

// Models and Services
import { OrderResponse } from "../../responses/order/order.response";
import { environment } from "../../environments/environment";
import { OrderService } from "../../services/order.service";
import { TokenService } from "../../services/token.service";

// External Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    NgClass,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    NgbModule
  ]
})
export class OrderDetailComponent implements OnInit{
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [] // Một mảng rỗng

  }
  orders: any[] = [];
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  getProductImageUrl(productImages: any[]): string {
    if (!productImages || productImages.length === 0) {
      return `${this.baseUrl}/products/images/default-image.png`; // Hoặc trả về một URL ảnh mặc định nếu không có ảnh
    }
    return `${this.baseUrl}/products/images/${productImages[0].image_url}`;
  }
  ngOnInit():void {
    const userId = this.tokenService.getUserId();
    this.getOrdersByUserId(userId);
  }
  recipientInfoDisplayed: boolean = false;

  getOrdersByUserId(userId: number): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (Array.isArray(response) && response.length > 0) {
          this.orders = response.map((order: any) => {
            let orderDate: string = '';
            let dateObj: Date | null = null;
            
            // Handle different date formats
            try {
              if (Array.isArray(order.orderDate) && order.orderDate.length >= 3) {
                dateObj = new Date(order.orderDate[0], order.orderDate[1] - 1, order.orderDate[2]);
              } else if (order.orderDate) {
                dateObj = new Date(order.orderDate);
              }
              
              if (dateObj && !isNaN(dateObj.getTime())) {
                orderDate = dateObj.toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });
              }
            } catch (error) {
              console.error('Error formatting date:', error);
            }
            
            let shippingDate: string = '';
            let shippingDateObj: Date | null = null;
            
            // Handle different date formats
            try {
              if (Array.isArray(order.shippingDate) && order.shippingDate.length >= 3) {
                shippingDateObj = new Date(order.shippingDate[0], order.shippingDate[1] - 1, order.shippingDate[2]);
              } else if (order.shippingDate) {
                shippingDateObj = new Date(order.shippingDate);
              }
              
              if (shippingDateObj && !isNaN(shippingDateObj.getTime())) {
                shippingDate = shippingDateObj.toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });
              }
            } catch (error) {
              console.error('Error formatting shipping date:', error);
            }

            return {
              id: order.id,
              user_id: order.id,
              fullname: order.fullName || '',
              email: order.email || '',
              phone_number: order.phoneNumber || '',
              address: order.address || '',
              note: order.note || '',
              order_date: orderDate,
              order_details: (order.orderDetails || []).map((orderDetail: any) => ({
                ...orderDetail,
                total_money: orderDetail.price * (orderDetail.numberOfProducts || 0),
                product: orderDetail.product || { 
                  name: 'Unknown Product', 
                  price: 0,
                  productImages: []
                }
              })),
              payment_method: order.paymentMethod || '',
              shipping_date: shippingDate,
              shipping_method: order.shippingMethod || '',
              status: order.status || 'PENDING',
              total_money: order.totalMoney || 0
            };
          });
        } else {
          console.error('Empty or invalid response:', response);
        }
      },
      error: (error: any) => {
        console.error('Error fetching user orders:', error);
        // Thông báo lỗi cho người dùng hoặc xử lý lỗi khác tùy theo trường hợp
      }
    });
  }


  goToHomePage() {
    this.router.navigate(['/']);
    window.scrollTo(0, 0); 
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPED':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã nhận hàng';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'FAILED':
        return 'Thất bại';
      case 'PAID':
        return 'Đã thanh toán';
      default:
        return status;
    }
  }

}

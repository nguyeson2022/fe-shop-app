import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayosService } from '../../services/payos.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.css', '../../styles/payos-payment.css']
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {

  // Payment info
  checkoutUrl: string = '';
  qrCodeString: string = '';
  qrCodeImageUrl: string = '';
  orderCode: number = 0;
  totalAmount: number = 0;
  isLoading: boolean = true;
  paymentStatus: string = 'pending'; // pending, success, failed

  // Order info
  orderInfo: any = null;
  orderData: any = null; // Full order data để tạo order
  buyerInfo: any = null;
  orderItems: any[] = [];

  // Timer
  statusCheckInterval: any;
  paymentTimer: number = 300; // 5 minutes countdown
  timerInterval: any;
  statusCheckCount: number = 0;
  maxStatusChecks: number = 50;
  successCountdown: number = 5;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly payosService: PayosService,
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Lấy thông tin từ route params hoặc query params
    this.route.queryParams.subscribe(params => {
      this.checkoutUrl = params['checkoutUrl'] || '';
      this.qrCodeString = params['qrCode'] || '';
      this.orderCode = parseInt(params['orderCode']) || 0;
      this.totalAmount = parseInt(params['amount']) || 0;

      // Nhận orderData thay vì orderInfo
      if (params['orderData']) {
        try {
          this.orderData = JSON.parse(decodeURIComponent(params['orderData']));
          this.extractOrderDetailsFromData();
        } catch (error) {
          console.error('Error parsing order data:', error);
        }
      }
      
      // Backward compatibility với orderInfo cũ
      if (params['orderInfo']) {
        try {
          this.orderInfo = JSON.parse(decodeURIComponent(params['orderInfo']));
          this.extractOrderDetails();
        } catch (error) {
          console.error('Error parsing order info:', error);
        }
      }

      if (this.qrCodeString) {
        this.generateQRCodeImage();
      }

      if ((this.checkoutUrl || this.qrCodeString) && this.orderCode) {
        this.isLoading = false;
        this.startPaymentStatusCheck();
        this.startCountdownTimer();
      } else {
        this.router.navigate(['/order']);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAllIntervals();
  }

  extractOrderDetails(): void {
    if (this.orderInfo) {
      this.buyerInfo = {
        fullname: this.orderInfo.fullname || '',
        email: this.orderInfo.email || '',
        phone_number: this.orderInfo.phone_number || '',
        address: this.orderInfo.address || ''
      };

      this.orderItems = this.orderInfo.cart_items || [];
    }
  }

  extractOrderDetailsFromData(): void {
    if (this.orderData) {
      this.buyerInfo = {
        fullname: this.orderData.fullname || '',
        email: this.orderData.email || '',
        phone_number: this.orderData.phone_number || '',
        address: this.orderData.address || ''
      };

      this.orderItems = this.orderData.cart_items_detail || [];
    }
  }

  startPaymentStatusCheck(): void {
    this.statusCheckCount = 0; // Reset counter

    this.statusCheckInterval = setInterval(() => {
      this.statusCheckCount++;

      // Kiểm tra số lần gọi đã đạt tối đa chưa
      if (this.statusCheckCount > this.maxStatusChecks) {
        console.log(`Đã kiểm tra ${this.maxStatusChecks} lần, dừng kiểm tra trạng thái thanh toán`);
        this.clearAllIntervals();
        // Giữ nguyên paymentStatus = 'pending' để QR code vẫn hiển thị
        return;
      }

      console.log(`Kiểm tra trạng thái thanh toán lần ${this.statusCheckCount}/${this.maxStatusChecks}`);

      this.payosService.checkPaymentStatus(this.orderCode).subscribe({
        next: (response) => {
          if (response.error === 0 && response.data?.status === 'PAID') {
            this.paymentStatus = 'success';
            this.clearAllIntervals();
            
            // Hiển thị toast thành công
            this.toastr.success('Thanh toán thành công!', 'Thành công');
            
            // Tạo order sau khi thanh toán thành công
            if (this.orderData) {
              this.createOrderAfterPayment();
            } else {
              // Fallback: chuyển về trang chủ nếu không có orderData
              this.startSuccessCountdown();
            }
          }
        },
        error: (error) => {
          console.error('Error checking payment status:', error);
        }
      });
    }, 3000); // Check every 3 seconds
  }

  startCountdownTimer(): void {
    this.timerInterval = setInterval(() => {
      this.paymentTimer--;
      if (this.paymentTimer <= 0) {
        this.paymentStatus = 'expired';
        this.clearAllIntervals();
      }
    }, 1000);
  }

  private clearAllIntervals(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  async generateQRCodeImage(): Promise<void> {
    if (!this.qrCodeString) {
      console.log('No QR code string available');
      return;
    }

    try {
      console.log('Generating QR code from string:', this.qrCodeString);
      this.qrCodeImageUrl = await QRCode.toDataURL(this.qrCodeString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      console.log('QR code generated successfully');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/default-product-image.png';
    return `${environment.apiBaseUrl}/products/images/${imagePath}`;
  }

  openInNewTab(): void {
    window.open(this.checkoutUrl, '_blank');
  }

  goBack(): void {
    // Dừng tất cả interval đang chạy
    this.clearAllIntervals();

    // Hiển thị toast thông báo hủy thanh toán
    this.toastr.success('Hủy thanh toán thành công', 'Thành công');

    // Quay về trang order
    this.router.navigate(['/orders']);
  }

  retryPayment(): void {
    this.paymentStatus = 'pending';
    this.paymentTimer = 300;
    this.statusCheckCount = 0; // Reset counter khi retry
    this.startPaymentStatusCheck();
    this.startCountdownTimer();
  }

  createOrderAfterPayment(): void {
    console.log('Creating order after successful payment...');
    
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.toastr.success('Đặt hàng thành công!', 'Thành công');
        
        // Clear giỏ hàng sau khi đặt hàng thành công
        this.cartService.cleanCart();
        console.log('Cart cleared after successful order');
        
        // Bắt đầu countdown sau khi tạo order thành công
        this.startSuccessCountdown();
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.toastr.error('Lỗi khi tạo đơn hàng. Vui lòng liên hệ hỗ trợ.', 'Lỗi');
        
        // Vẫn chuyển về trang chủ dù có lỗi
        this.startSuccessCountdown();
      }
    });
  }

  startSuccessCountdown(): void {
    // Start countdown từ 5 về 0
    this.successCountdown = 5;
    const countdownInterval = setInterval(() => {
      this.successCountdown--;
      if (this.successCountdown <= 0) {
        clearInterval(countdownInterval);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
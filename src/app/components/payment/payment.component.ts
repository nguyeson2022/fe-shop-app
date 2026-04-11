// src/app/components/payment/payment.component.ts
import { Component } from '@angular/core';
import { PayosService } from '../../services/payos.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css', '../../styles/payos-payment.css'],
  providers: [CurrencyPipe]
})
export class PaymentComponent {
  loading = false;
  paymentVisible = false;
  currentOrderCode?: number;
  realOrderCode?: number = 1;
  paymentForm = {
    amount: 50000,
    description: 'Thanh toán đơn hàng',
    customerName: '',
    customerEmail: '',
    items: [
      {
        name: 'Sản phẩm demo',
        quantity: 1,
        price: 50000
      }
    ]
  };

  constructor(
    private readonly payosService: PayosService,
    private readonly router: Router
  ) {}

  createPayment() {
    this.loading = true;
    this.currentOrderCode = Date.now();
    
    this.payosService.createPaymentLink({
      amount: this.paymentForm.amount,
      orderCode: this.currentOrderCode,
      buyerName: this.paymentForm.customerName,
      buyerEmail: this.paymentForm.customerEmail
    }).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.error === 0 && response.data?.checkoutUrl) {
          // Hiển thị QR code trong container
          this.payosService.showPaymentQR(response.data.checkoutUrl, 'payos-container');
          this.paymentVisible = true;
          this.realOrderCode = response.data.orderCode;
          // Bắt đầu check trạng thái thanh toán
          this.startPaymentStatusCheck();
        } else {
          alert('Có lỗi xảy ra: ' + response.message);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Payment error:', error);
        alert('Có lỗi xảy ra khi tạo thanh toán');
      }
    });
  }

  // Kiểm tra trạng thái thanh toán định kỳ
  private startPaymentStatusCheck() {
    if (!this.realOrderCode) return;
    
    const interval = setInterval(() => {
      this.payosService.checkPaymentStatus(this.realOrderCode!).subscribe({
        next: (response) => {
          if (response.error === 0 && response.data?.status === 'PAID') {
            clearInterval(interval);
            this.onPaymentSuccess();
          }
        },
        error: (error) => {
          console.error('Error checking payment status:', error);
        }
      });
    }, 3000); // Check mỗi 3 giây

    // Dừng check sau 10 phút
    setTimeout(() => clearInterval(interval), 600000);
  }

  private onPaymentSuccess() {
    alert('Thanh toán thành công!');
    this.hidePayment();
    this.router.navigate(['/payment-success']);
  }

  hidePayment() {
    this.payosService.hidePayment('payos-container');
    this.paymentVisible = false;
    this.currentOrderCode = undefined;
  }

  updateAmount() {
    this.paymentForm.items[0].price = this.paymentForm.amount;
  }
}
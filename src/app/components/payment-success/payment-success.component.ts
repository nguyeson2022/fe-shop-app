// src/app/components/payment-success/payment-success.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayosService } from '../../services/payos.service';

@Component({
  selector: 'app-payment-success',
  template: `
    <div class="result-container success">
      <h2>✅ Thanh toán thành công!</h2>
      <div *ngIf="paymentInfo">
        <p><strong>Mã đơn hàng:</strong> {{ paymentInfo.orderCode }}</p>
        <p><strong>Số tiền:</strong> {{ paymentInfo.amount | currency:'VND':'symbol':'1.0-0' }}</p>
        <p><strong>Trạng thái:</strong> {{ paymentInfo.status }}</p>
      </div>
      <button (click)="goHome()">Về trang chủ</button>
    </div>
  `
})
export class PaymentSuccessComponent implements OnInit {
  paymentInfo: any;

  constructor(
    private route: ActivatedRoute,
    private payosService: PayosService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // if (params['orderCode']) {
      //   this.checkPaymentStatus(params['orderCode']);
      // }
    });
  }

  // checkPaymentStatus(orderCode: string) {
  //   this.payosService.getPaymentStatus(Number(orderCode)).subscribe({
  //     next: (response) => {
  //       this.paymentInfo = response.data;
  //     },
  //     error: (error) => {
  //       console.error('Error checking payment status:', error);
  //     }
  //   });
  // }

  goHome() {
    window.location.href = '/';
  }
}
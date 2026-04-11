import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// PayOS Response từ backend
export interface PayOSResponse {
  error: number;        // 0 = success, -1 = error
  message: string;      // "success" hoặc error message
  data: {
    checkoutUrl: string;
    qrCode: string;
    orderCode: number;
    amount: number;
    description: string;
    status: string;
  } | null;
}

// Interface cho payment request
export interface PayOSPaymentRequest {
  amount: number;
  orderCode?: number;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayosService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * TẠO PAYMENT LINK
   * Gọi API backend để tạo link thanh toán PayOS
   */
  createPaymentLink(request: PayOSPaymentRequest): Observable<PayOSResponse> {
    const paymentData = {
      orderCode: request.orderCode || Date.now(),
      amount: request.amount,
      description: `Thanh toán đơn hàng #${request.orderCode || Date.now()}`,
      items: [{
        name: 'Đơn hàng',
        quantity: 1,
        price: request.amount
      }],
      returnUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/order`,
      buyerName: request.buyerName,
      buyerEmail: request.buyerEmail,
      buyerPhone: request.buyerPhone
    };

    return this.http.post<PayOSResponse>(
      `${this.apiBaseUrl}/payments/payos/create-embedded-payment-link`, 
      paymentData
    );
  }

  /**
   * HIỂN THỊ QR CODE
   * Tạo và hiển thị QR code PayOS ở vị trí chỉ định
   */
  showPaymentQR(checkoutUrl: string, containerId: string): void {
    console.log('=== PayOS showPaymentQR Debug ===');
    console.log('CheckoutUrl:', checkoutUrl);
    console.log('ContainerId:', containerId);
    
    // Thử tìm container với retry mechanism
    this.findContainerWithRetry(containerId, 5, 500).then(container => {
      if (!container) {
        console.error(`❌ Container ${containerId} không tìm thấy sau khi thử nhiều lần!`);
        alert(`Container ${containerId} không tìm thấy! Vui lòng kiểm tra lại HTML.`);
        return;
      }

      console.log('✅ Container found:', container);
      
      // Xóa nội dung cũ
      container.innerHTML = '';
      console.log('Container cleared');

      // Tạo payment interface với better error handling
      const paymentHTML = this.createPaymentHTML(checkoutUrl, containerId);
      
      container.innerHTML = paymentHTML;
      console.log('Payment HTML inserted');

      // Hiển thị container với animation
      this.showContainerWithAnimation(container);
      
    }).catch(error => {
      console.error('Error finding container:', error);
      alert('Lỗi khi tìm container thanh toán!');
    });
  }

  /**
   * TÌM CONTAINER VỚI RETRY MECHANISM
   */
  private async findContainerWithRetry(containerId: string, maxRetries: number, delay: number): Promise<HTMLElement | null> {
    for (let i = 0; i < maxRetries; i++) {
      console.log(`🔍 Attempt ${i + 1}/${maxRetries} to find container: ${containerId}`);
      
      const container = document.getElementById(containerId);
      if (container) {
        console.log(`✅ Container found on attempt ${i + 1}`);
        return container;
      }
      
      // Thử tìm bằng querySelector backup
      const containerByQuery = document.querySelector(`#${containerId}`) as HTMLElement;
      if (containerByQuery) {
        console.log(`✅ Container found via querySelector on attempt ${i + 1}`);
        return containerByQuery;
      }
      
      // Wait before next retry
      if (i < maxRetries - 1) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.error(`❌ Container ${containerId} not found after ${maxRetries} attempts`);
    
    // Debug: List all available IDs
    const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    console.log('📋 Available element IDs:', allIds);
    
    return null;
  }

  /**
   * TẠO HTML CHO PAYMENT INTERFACE
   */
  private createPaymentHTML(checkoutUrl: string, containerId: string): string {
    return `
      <div class="payos-payment-container" style="background: white; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 10px 0; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
        <div class="payment-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 15px;">
          <h4 style="margin: 0 0 8px 0; font-size: 18px;">💳 Thanh toán PayOS</h4>
          <p style="margin: 0; font-size: 14px;">Vui lòng quét mã QR để thanh toán</p>
        </div>
        
        <div class="qr-container" style="text-align: center; padding: 10px;">
          <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <small style="color: #666;">🔗 URL: <a href="${checkoutUrl}" target="_blank" style="color: #007bff;">Mở trong tab mới</a></small>
          </div>
          
          <iframe 
            src="${checkoutUrl}" 
            width="100%" 
            height="700px"
            style="border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
            title="PayOS Payment"
            frameborder="0"
            onload="console.log('✅ PayOS iframe loaded successfully')"
            onerror="console.error('❌ PayOS iframe failed to load')">
          </iframe>
        </div>
        
        <div class="payment-actions" style="text-align: center; margin-top: 15px;">
          <button 
            onclick="document.getElementById('${containerId}').style.display='none'"
            style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
            Đóng thanh toán
          </button>
          <button 
            onclick="window.open('${checkoutUrl}', '_blank')"
            style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            Mở tab mới
          </button>
        </div>
      </div>
    `;
  }

  /**
   * HIỂN THỊ CONTAINER VỚI ANIMATION
   */
  private showContainerWithAnimation(container: HTMLElement): void {
    // Hiển thị container
    container.style.display = 'block';
    container.style.visibility = 'visible';
    console.log('✅ Container made visible');
    
    // Animation
    setTimeout(() => {
      const paymentContainer = container.querySelector('.payos-payment-container') as HTMLElement;
      if (paymentContainer) {
        paymentContainer.style.opacity = '1';
        paymentContainer.style.transform = 'translateY(0)';
      }
      
      // Scroll to view
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('✅ Animated and scrolled to container');
    }, 50);
  }

  /**
   * ẨN PAYMENT INTERFACE
   */
  hidePayment(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      container.style.display = 'none';
      container.innerHTML = '';
    }
  }

  /**
   * KIỂM TRA TRẠNG THÁI THANH TOÁN
   */
  checkPaymentStatus(orderCode: number): Observable<PayOSResponse> {
    return this.http.get<PayOSResponse>(
      `${this.apiBaseUrl}/payments/payos/payment-info/${orderCode}`
    );
  }

  /**
   * PHƯƠNG THỨC TIỆN LỢI CHO ORDER
   * Sử dụng khi có order để thanh toán
   */
  initiatePayment(totalMoney: number, orderCode?: number, buyerInfo?: any): Observable<PayOSResponse> {
    return this.createPaymentLink({
      amount: totalMoney,
      orderCode: orderCode,
      buyerName: buyerInfo?.fullname,
      buyerEmail: buyerInfo?.email,
      buyerPhone: buyerInfo?.phone_number
    });
  }
}
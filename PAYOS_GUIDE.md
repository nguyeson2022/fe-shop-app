# Hướng dẫn sử dụng PayOS Service mới (Đã tối ưu)

## 🎯 Tổng quan
PayOS Service đã được **đơn giản hóa** và **tối ưu** để dễ sử dụng và bảo trì. Loại bỏ hết code phức tạp, chỉ giữ lại những tính năng cần thiết.

## 📋 Các tính năng chính

### 1. Tạo Payment Link
```typescript
this.payosService.createPaymentLink({
  amount: 50000,
  orderCode: Date.now(),
  buyerName: 'Nguyễn Văn A',
  buyerEmail: 'email@example.com',
  buyerPhone: '0123456789'
}).subscribe(response => {
  if (response.error === 0) {
    // Thành công
    console.log(response.data.checkoutUrl);
  }
});
```

### 2. Hiển thị QR Code tại vị trí chỉ định
```typescript
// Hiển thị QR PayOS trong container có id="payment-container"
this.payosService.showPaymentQR(checkoutUrl, 'payment-container');
```

### 3. Ẩn Payment Interface
```typescript
this.payosService.hidePayment('payment-container');
```

### 4. Kiểm tra trạng thái thanh toán
```typescript
this.payosService.checkPaymentStatus(orderCode).subscribe(response => {
  if (response.data?.status === 'PAID') {
    // Thanh toán thành công
  }
});
```

### 5. Sử dụng nhanh với thông tin order
```typescript
// Dành cho component order
this.payosService.initiatePayment(totalMoney, orderCode, buyerInfo)
```

## 🎨 CSS Styling
File CSS cho PayOS đã được tạo tự động tại: `src/app/styles/payos-payment.css`

Các class CSS có sẵn:
- `.payos-payment-container` - Container chính
- `.payment-header` - Header với gradient đẹp
- `.qr-container` - Container chứa QR code
- `.payment-actions` - Nút hành động
- `.btn-close-payment` - Nút đóng thanh toán

## 📱 HTML Template
Trong component template, chỉ cần có container:
```html
<div id="payos-container" style="display: none;"></div>
```

## 🚀 Ví dụ sử dụng hoàn chình

### Component TypeScript:
```typescript
import { PayosService } from './services/payos.service';

constructor(private payosService: PayosService) {}

createPayment() {
  this.payosService.createPaymentLink({
    amount: 100000,
    buyerName: 'Khách hàng'
  }).subscribe(response => {
    if (response.error === 0) {
      // Hiển thị QR tại vị trí mong muốn
      this.payosService.showPaymentQR(
        response.data.checkoutUrl, 
        'my-payment-container'
      );
      
      // Bắt đầu check trạng thái
      this.checkPaymentStatus(response.data.orderCode);
    }
  });
}

checkPaymentStatus(orderCode: number) {
  const interval = setInterval(() => {
    this.payosService.checkPaymentStatus(orderCode).subscribe(response => {
      if (response.data?.status === 'PAID') {
        clearInterval(interval);
        this.onPaymentSuccess();
      }
    });
  }, 3000);
}
```

### Component HTML:
```html
<button (click)="createPayment()">Thanh toán</button>
<div id="my-payment-container"></div>
```

## ✨ Ưu điểm của service mới

1. **Đơn giản**: Chỉ 120 dòng code thay vì 316 dòng
2. **Dễ hiểu**: Mỗi method có một nhiệm vụ rõ ràng
3. **Không phụ thuộc**: Không cần PayOS SDK phức tạp
4. **QR đúng vị trí**: Hiển thị chính xác nơi mong muốn
5. **Responsive**: Tự động responsive trên mobile
6. **Dễ maintain**: Code rõ ràng, dễ bảo trì

## 🔧 Cấu hình

Service tự động sử dụng:
- `environment.apiBaseUrl` để gọi backend
- Tự động tạo returnUrl và cancelUrl
- Tự động format dữ liệu phù hợp với backend

## 📞 Support Methods

- `createPaymentLink()` - Tạo link thanh toán
- `showPaymentQR()` - Hiển thị QR code
- `hidePayment()` - Ẩn giao diện thanh toán  
- `checkPaymentStatus()` - Check trạng thái
- `initiatePayment()` - Phương thức tiện lợi cho order

## 🎉 Kết quả

✅ Code PayOS đã được **đơn giản hóa** từ 316 dòng xuống 120 dòng
✅ QR code hiển thị **đúng vị trí** theo yêu cầu
✅ **Không còn code thừa** - chỉ giữ tính năng cần thiết
✅ Dễ **maintain** và **debug** hơn nhiều
✅ Giao diện **đẹp** và **professional**
# 🚀 Hướng Dẫn Chuyển Đổi Sang PayOS Embedded Checkout

## ✅ **Đã Hoàn Thành**

### 1. **Cài Đặt Package**
```bash
npm install @payos/payos-checkout
```

### 2. **Cập Nhật File Đã Thay Đổi**
- ✅ `src/app/services/payos.service.ts` - Service PayOS với embedded checkout
- ✅ `src/app/components/order/order.component.ts` - Logic Angular PayOS
- ✅ `src/app/components/order/order.component.html` - UI với embedded container
- ✅ `src/app/components/order/order.component.css` - Styling cho PayOS
- ✅ `src/index.html` - Thêm PayOS CDN script

## 🔧 **Cấu Hình Cần Thiết**

### 1. **Environment Configuration**
Cập nhật `src/app/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
  payos: {
    clientId: 'YOUR_PAYOS_CLIENT_ID',      // Từ PayOS Dashboard
    apiKey: 'YOUR_PAYOS_API_KEY',          // Từ PayOS Dashboard  
    checksumKey: 'YOUR_PAYOS_CHECKSUM_KEY', // Từ PayOS Dashboard
    baseUrl: 'https://api-merchant.payos.vn'
  }
};
```

### 2. **Backend API Endpoints**
Backend cần có các endpoints:

#### **a) POST `/api/v1/payos/create-embedded-payment`**
```java
@PostMapping("/payos/create-embedded-payment")
public ResponseEntity<PaymentResponse> createEmbeddedPayment(@RequestBody PaymentRequest request) {
    // Logic tạo embedded payment link
    PayOS payOS = new PayOS(clientId, apiKey, checksumKey);
    
    PaymentData paymentData = PaymentData.builder()
        .orderCode(request.getOrderCode())
        .amount(request.getAmount())
        .description(request.getDescription())
        .items(request.getItems())
        .returnUrl(request.getReturnUrl())
        .cancelUrl(request.getCancelUrl())
        .build();
        
    PaymentLinkData result = payOS.createPaymentLink(paymentData);
    
    return ResponseEntity.ok(PaymentResponse.builder()
        .error(0)
        .message("Success")
        .data(result)
        .build());
}
```

#### **b) GET `/api/v1/payos/payment-status/{orderCode}`**
```java
@GetMapping("/payos/payment-status/{orderCode}")
public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Long orderCode) {
    PayOS payOS = new PayOS(clientId, apiKey, checksumKey);
    PaymentLinkData paymentInfo = payOS.getPaymentLinkInformation(orderCode);
    return ResponseEntity.ok(paymentInfo);
}
```

### 3. **PayOS Dependencies (Backend)**
Trong `pom.xml`:
```xml
<dependency>
    <groupId>vn.payos</groupId>
    <artifactId>payos</artifactId>
    <version>1.0.5</version>
</dependency>
```

## 📱 **Các Tính Năng Mới**

### 1. **Embedded Checkout UI**
- ✅ Hiển thị form thanh toán nhúng ngay trong trang order
- ✅ Loading state khi tạo payment link
- ✅ Button đóng checkout
- ✅ Responsive design

### 2. **Payment Flow**
1. User click "Đặt hàng"
2. Hiển thị loading "Đang tạo link thanh toán..."
3. Call API tạo embedded payment link
4. Hiển thị PayOS embedded checkout
5. User thanh toán trực tiếp trong iframe
6. Callback success/cancel được xử lý

### 3. **Event Handling**
```typescript
payOSConfig = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: 'embedded-payment-container',
  CHECKOUT_URL: checkoutUrl,
  embedded: true,
  onSuccess: (event) => {
    // Thanh toán thành công
    this.router.navigate(['/']);
  },
  onCancel: (event) => {
    // Thanh toán bị hủy
  },
  onExit: (event) => {
    // Đóng checkout
  }
};
```

## 🎯 **So Sánh VNPay vs PayOS Embedded**

| Tiêu chí | VNPay | PayOS Embedded |
|----------|-------|----------------|
| UI/UX | Redirect sang trang khác | Nhúng trong trang hiện tại |
| User Experience | Phải rời khỏi website | Không rời khỏi website |
| Response | `paymentUrl` | `checkoutUrl` |
| Success Code | `code: 200` | `error: 0` |
| Integration | Đơn giản | Phức tạp hơn nhưng UX tốt hơn |

## 🚨 **Lưu Ý Quan Trọng**

### 1. **CORS Configuration**
Backend cần cấu hình CORS cho PayOS:
```java
@CrossOrigin(origins = {"http://localhost:4200", "https://your-domain.com"})
```

### 2. **Webhook Handler**
```java
@PostMapping("/payos/webhook")
public ResponseEntity<String> handlePayOSWebhook(@RequestBody WebhookData webhookData) {
    // Verify webhook signature
    // Update order status in database
    return ResponseEntity.ok("OK");
}
```

### 3. **Error Handling**
- Kiểm tra PayOS script đã load chưa
- Handle timeout khi tạo payment link
- Fallback khi embedded checkout fail

### 4. **Security**
- ❗ **Không** để lộ API keys trong frontend
- ✅ Tất cả PayOS API calls phải qua backend
- ✅ Verify webhook signatures

## 🧪 **Testing**

### 1. **Test Cases**
- [ ] Tạo payment link thành công
- [ ] Hiển thị embedded checkout
- [ ] Thanh toán thành công callback
- [ ] Thanh toán bị hủy callback
- [ ] Error handling khi API fail
- [ ] Responsive trên mobile

### 2. **Test Data**
PayOS Sandbox:
- Test Card: 9704 0000 0000 0018
- OTP: 123456

## 🚀 **Deployment Checklist**

- [ ] Cập nhật environment.prod.ts với PayOS credentials thật
- [ ] Deploy backend với PayOS endpoints
- [ ] Test trên production environment
- [ ] Monitor payment success rates
- [ ] Setup webhook endpoints

## 📞 **Hỗ Trợ**

Nếu có vấn đề:
1. Kiểm tra Browser Console cho errors
2. Kiểm tra Network tab cho API calls
3. Verify PayOS credentials
4. Check backend logs

---

**🎉 Chuyển đổi hoàn tất! Dự án giờ sử dụng PayOS Embedded Checkout với UX tốt hơn VNPay.**
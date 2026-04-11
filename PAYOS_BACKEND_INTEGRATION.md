# 🚀 Hướng Dẫn Tích Hợp PayOS Frontend với Backend Controller

## ✅ **Đã Cập Nhật Frontend**

### 1. **PayOS Service** (`src/app/services/payos.service.ts`)
- ✅ Cập nhật interfaces khớp với backend DTOs
- ✅ Endpoints khớp với controller:
  - `POST /payments/payos/create-embedded-payment-link`
  - `POST /payments/payos/create-payment-link` 
  - `GET /payments/payos/payment-info/{orderCode}`
  - `POST /payments/payos/cancel/{orderCode}`

### 2. **Order Component** (`src/app/components/order/order.component.ts`)
- ✅ Sử dụng `PayOSPaymentRequestDTO` interface
- ✅ Xử lý response đúng format từ backend
- ✅ Error handling khớp với backend response

### 3. **Payment Component** (`src/app/components/payment/payment.component.ts`)  
- ✅ Cập nhật sử dụng interface mới

## 🔧 **Backend Controller Endpoints**

Theo controller bạn cung cấp:

### **1. Create Embedded Payment Link**
```typescript
// Frontend call
const request: PayOSPaymentRequestDTO = {
  orderCode: Date.now(),
  amount: 50000,
  description: "Thanh toán đơn hàng #123",
  items: [{
    name: "Đơn hàng",
    quantity: 1, 
    price: 50000
  }],
  returnUrl: "http://localhost:4200/payment-success",
  cancelUrl: "http://localhost:4200/order",
  buyerName: "Nguyễn Văn A",
  buyerEmail: "user@example.com",
  buyerPhone: "0123456789"
};

this.payosService.createEmbeddedPaymentLink(request).subscribe({
  next: (response: PayOSPaymentResponseDTO) => {
    if (response.error === 0) {
      // Success: response.data.checkoutUrl
      this.initializePayOSCheckout(response.data.checkoutUrl);
    }
  },
  error: (error) => {
    // Handle error
    console.error('PayOS Error:', error);
  }
});
```

### **2. Get Payment Information**
```typescript
// Frontend call
this.payosService.getPaymentInformation(orderCode).subscribe({
  next: (paymentInfo) => {
    console.log('Payment Status:', paymentInfo);
  }
});
```

### **3. Cancel Payment**
```typescript  
// Frontend call
this.payosService.cancelPayment(orderCode, 'Hủy thanh toán').subscribe({
  next: (result) => {
    console.log('Payment cancelled:', result);
  }
});
```

## 📋 **Request/Response Interfaces**

### **PayOSPaymentRequestDTO** (Frontend → Backend)
```typescript
interface PayOSPaymentRequestDTO {
  orderCode?: number;           // Optional, backend tự generate nếu null
  amount: number;              // Số tiền (VNĐ)
  description: string;         // Mô tả thanh toán
  items: PaymentItem[];        // Danh sách items
  returnUrl: string;           // URL khi thanh toán thành công
  cancelUrl: string;           // URL khi hủy thanh toán
  buyerName?: string;          // Tên người mua
  buyerEmail?: string;         // Email người mua  
  buyerPhone?: string;         // SĐT người mua
  buyerAddress?: string;       // Địa chỉ người mua
  expiredAt?: number;          // Thời gian hết hạn (timestamp)
}
```

### **PayOSPaymentResponseDTO** (Backend → Frontend)
```typescript
interface PayOSPaymentResponseDTO {
  error: number;               // 0 = success, khác 0 = error
  message: string;             // Thông báo
  data: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;       // URL để embedded checkout
    qrCode: string;
  };
}
```

## 🎯 **Test Flow**

### **1. Test Embedded Payment**
1. Navigate to `/order`
2. Fill form thông tin người nhận
3. Click "Đặt hàng" 
4. Kiểm tra:
   - Loading state hiển thị
   - API call tới `/payments/payos/create-embedded-payment-link`
   - Embedded checkout container xuất hiện
   - PayOS iframe load trong container

### **2. Test Payment Success**
- PayOS callback `onSuccess` được gọi
- User redirect về trang chủ
- Success message hiển thị

### **3. Test Payment Cancel**  
- PayOS callback `onCancel` được gọi
- Warning message hiển thị
- User ở lại trang order

## 🚨 **Lưu Ý Backend Integration**

### **1. CORS Configuration**
Backend cần cấu hình CORS:
```java
@CrossOrigin(origins = {"http://localhost:4200", "https://your-domain.com"})
```

### **2. Webhook Handler** 
Controller đã có webhook endpoint:
```java
@PostMapping("/webhook")
public ResponseEntity<?> handleWebhook(@RequestBody String webhookData)
```

Cần implement logic:
- Verify webhook signature từ PayOS
- Update order status trong database
- Send confirmation email
- Log transaction

### **3. Error Response Format**
Backend nên trả về consistent error format:
```json
{
  "error": 1,
  "message": "Lỗi tạo payment link: Invalid amount",
  "data": null
}
```

### **4. Environment Variables**
Backend cần cấu hình:
```properties
# application.yml
payos:
  client-id: ${PAYOS_CLIENT_ID}
  api-key: ${PAYOS_API_KEY}  
  checksum-key: ${PAYOS_CHECKSUM_KEY}
  
api:
  prefix: /api/v1
```

## 📱 **Frontend Environment**

Cập nhật `src/app/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
  // PayOS config không cần thiết ở frontend nữa
  // vì tất cả đã được handle ở backend
};
```

## 🧪 **Testing Checklist**

- [ ] Backend PayOS service hoạt động
- [ ] Frontend API calls success
- [ ] Embedded checkout hiển thị đúng
- [ ] Success callback hoạt động
- [ ] Cancel callback hoạt động  
- [ ] Error handling đúng
- [ ] Responsive design
- [ ] Webhook processing

## 🚀 **Deployment**

### **Production Checklist:**
- [ ] Update `environment.prod.ts` với API URL production
- [ ] Backend deployed với PayOS production credentials
- [ ] HTTPS enabled cho webhook  
- [ ] CORS configured cho production domain
- [ ] Monitor payment success rates

---

**🎉 Frontend đã được cập nhật hoàn toàn để tích hợp với backend PayOS controller của bạn!**

**Next Steps:**
1. Test integration với backend local
2. Verify embedded checkout hoạt động
3. Test toàn bộ payment flow
4. Deploy và monitor
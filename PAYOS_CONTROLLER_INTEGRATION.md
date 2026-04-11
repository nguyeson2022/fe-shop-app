# 🚀 Frontend Cập Nhật Khớp Với Backend PayOS Controller

## ✅ **Đã Cập Nhật Hoàn Toàn**

### 🔧 **Các Thay Đổi Chính**

#### **1. Response Format** 
Backend trả về `ObjectNode` với cấu trúc:
```json
{
  "error": 0,        // 0 = success, -1 = fail
  "message": "success", // "success"/"fail"/error message
  "data": {...}      // CheckoutResponseData hoặc null
}
```

#### **2. HTTP Methods**
- ✅ **Create Payment**: `POST /payments/payos/create-payment-link`
- ✅ **Create Embedded**: `POST /payments/payos/create-embedded-payment-link` 
- ✅ **Get Info**: `GET /payments/payos/payment-info/{orderCode}`
- ✅ **Cancel**: `PUT /payments/payos/cancel/{orderCode}` (đã sửa từ POST)
- ✅ **Webhook**: `POST /payments/payos/webhook`

## 📋 **Interfaces Đã Cập Nhật**

### **PayOSResponse** (Backend → Frontend)
```typescript
interface PayOSResponse {
  error: number;        // 0 = success, -1 = error
  message: string;      // "success"/"fail"/error message  
  data: CheckoutResponseData | null;
}
```

### **CheckoutResponseData** (PayOS Response)
```typescript
interface CheckoutResponseData {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;   // URL cho embedded checkout
  qrCode: string;
}
```

## 🎯 **Frontend API Calls**

### **1. Tạo Embedded Payment**
```typescript
const request: PayOSPaymentRequestDTO = {
  orderCode: Date.now(), // Optional - backend tự tạo nếu null
  amount: 50000,
  description: "Thanh toán đơn hàng #123",
  items: [{
    name: "Đơn hàng",
    quantity: 1,
    price: 50000
  }],
  returnUrl: "http://localhost:4200/payment-success",
  cancelUrl: "http://localhost:4200/order"
};

this.payosService.createEmbeddedPaymentLink(request).subscribe({
  next: (response: PayOSResponse) => {
    if (response.error === 0 && response.data) {
      // Success - Khởi tạo embedded checkout
      this.initializePayOSCheckout(response.data.checkoutUrl);
    } else {
      // Error - Hiển thị lỗi từ backend  
      alert(`Lỗi: ${response.message}`);
    }
  },
  error: (httpError) => {
    // HTTP Error (500, 404, etc.)
    console.error('HTTP Error:', httpError);
    alert('Có lỗi xảy ra khi gọi API');
  }
});
```

### **2. Lấy Thông Tin Payment**
```typescript
this.payosService.getPaymentInformation(orderCode).subscribe({
  next: (response: PayOSResponse) => {
    if (response.error === 0) {
      console.log('Payment Info:', response.data);
    } else {
      console.error('Get payment info failed:', response.message);
    }
  }
});
```

### **3. Hủy Payment**
```typescript
this.payosService.cancelPayment(orderCode, 'Khách hàng hủy').subscribe({
  next: (response: PayOSResponse) => {
    if (response.error === 0) {
      console.log('Payment cancelled successfully');
    } else {
      console.error('Cancel failed:', response.message);
    }
  }
});
```

## 🔄 **Backend Controller Flow**

### **Create Embedded Payment Link**
1. **Frontend gửi**: `PayOSPaymentRequestDTO`
2. **Backend xử lý**:
   - Tạo `orderCode` nếu null (last 6 digits of timestamp)
   - Build `ItemData` từ request.items[0]  
   - Build `PaymentData`
   - Call `payOS.createPaymentLink()`
   - Return `ObjectNode` response
3. **Frontend nhận**: `PayOSResponse` với `CheckoutResponseData`

### **Error Handling**
Backend controller đã handle exceptions:
```java
try {
    // PayOS logic
    response.put("error", 0);
    response.put("message", "success");
    response.set("data", objectMapper.valueToTree(data));
} catch (Exception e) {
    log.error("Error: ", e);
    response.put("error", -1);
    response.put("message", "fail: " + e.getMessage());
    response.set("data", null);
}
```

Frontend xử lý:
```typescript
if (response.error === 0) {
  // Success case
} else {
  // Error case - hiển thị response.message
  alert(`Lỗi: ${response.message}`);
}
```

## 🧪 **Test Cases**

### **Test Embedded Payment:**
1. **Valid Request**:
   - ✅ `response.error === 0`
   - ✅ `response.message === "success"`  
   - ✅ `response.data.checkoutUrl` exists
   - ✅ Embedded checkout khởi tạo thành công

2. **Invalid Request**:
   - ✅ `response.error === -1`
   - ✅ `response.message` chứa error details
   - ✅ `response.data === null`
   - ✅ Frontend hiển thị error message

### **Test Cancel Payment:**
1. **Method**: Đã đổi từ `POST` sang `PUT`
2. **Response**: Same ObjectNode format
3. **Frontend**: Handle response.error correctly

## 🚨 **Quan Trọng**

### **1. OrderCode Generation**
Backend controller tạo orderCode khác nhau:
- **create-payment-link**: Last 6 digits of timestamp
- **create-embedded-payment-link**: `System.currentTimeMillis() / 1000`

### **2. Item Handling** 
Backend chỉ lấy `items[0]` (item đầu tiên):
```java
ItemData item = ItemData.builder()
    .name(requestDTO.getItems().get(0).getName())
    .price(requestDTO.getItems().get(0).getPrice())
    .quantity(requestDTO.getItems().get(0).getQuantity())
    .build();
```

### **3. Webhook Processing**
Backend webhook đã implement:
- ✅ Parse webhook data
- ✅ Check code === "00" for success
- ✅ Extract orderCode, amount, reference
- ✅ Log payment status
- ✅ Return consistent ObjectNode response

## 🚀 **Deployment Readiness**

Frontend đã sẵn sàng integrate với backend:
- ✅ Correct API endpoints
- ✅ Proper request/response interfaces  
- ✅ Error handling aligned
- ✅ HTTP method corrections (PUT for cancel)
- ✅ Response structure matching ObjectNode

---

**🎉 Frontend đã được cập nhật hoàn toàn để khớp với backend PayOS controller!**

**Test ngay**: Khởi động cả backend + frontend và test embedded payment flow.
export interface VnPayResponse {
    code: string;
    message: string;
    paymentUrl: string;
}


export interface TransactionInfoParams {
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_OrderInfo: string;
    vnp_ResponseCode: string;
}

export interface TransactionInfoResponse {
    code: number;
    message: string;
    data: VNPayResponse;
}

export interface VNPayResponse {
    code: string;
    message: string;
    paymentUrl: string;
}
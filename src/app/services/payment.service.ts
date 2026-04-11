import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, catchError, tap } from "rxjs";
import { TransactionInfoParams, TransactionInfoResponse, VnPayResponse } from "../models/payment";
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class VnPayService {
    private apiBaseUrl = environment.apiBaseUrl;
    constructor(private http: HttpClient,
        private router: Router
    ) { }

    initiatePayment(totalMoney: number, bankCode: string = 'NCB'): Observable<any> {
        const params = {
            amount: totalMoney.toString(),
            bankCode: bankCode
        };
        return this.http.get(`${this.apiBaseUrl}/payment/vn-pay`, { params: params });
    }

}
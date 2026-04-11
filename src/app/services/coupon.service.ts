import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Coupon, CouponCondition, CouponList, InsertCoupon, UpdateCouponCondition } from "../models/coupon";
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  calculateCouponValue(couponCode: string, totalAmount: number): Observable<any> {
    const url = `${this.apiBaseUrl}/coupons/calculate`;
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount.toString());

    return this.http.get<any>(url, { params });
  }

  getCoupons(page: number, limit: number): Observable<Coupon[]>{
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
  return this.http.get<Coupon[]>(`${this.apiBaseUrl}/coupons/search`, { params });
  }

  getAllCoupons(): Observable<Coupon[]>{
    return this.http.get<Coupon[]>(`${this.apiBaseUrl}/coupons`);
  }

  getAllListCoupons(): Observable<CouponList[]> {
    return this.http.get<CouponList[]>(`${this.apiBaseUrl}/coupons`);
  }

  updateCouponCondition(id: number, updatedCouponCondition: UpdateCouponCondition): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/coupon-conditions/${id}`, updatedCouponCondition);
  }

  addCoupon(coupon: InsertCoupon): Observable<InsertCoupon> {
    return this.http.post<any>(`${this.apiBaseUrl}/coupons`, coupon);
  }


  addCouponCondition(newCouponCondition: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/coupon-conditions/`, newCouponCondition);

  }

  deleteCouponCondition(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/coupon-conditions/${id}`);

  }

  getCouponConditionById(id: number): Observable<CouponCondition> {
    return this.http.get<CouponCondition>(`${this.apiBaseUrl}/coupon-conditions/${id}`);
  }
  

}
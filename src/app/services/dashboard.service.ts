import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import { Product } from "../models/product";
import {Observable} from "rxjs";
import { User } from "../models/user";
import { Category } from "../models/category";
import { ChartTotalResponse } from "../responses/order/chart.order.response";
import { CategoryAmountResponse } from "../responses/category/char.category.response";

@Injectable({
  providedIn: 'root'
})
export class DashBoardService{

  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getTotalProduct(): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/products/count`);
  }

  getTotalUser(): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/users/count`);
  }

  getTotalCategory(): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/categories/count`);
  }

  getTotalMoneyByMonth(year: number): Observable<ChartTotalResponse[]> {
    const url = `${this.apiBaseUrl}/orders/totalMoneyByMonth`;
    let params = new HttpParams().set('year', year.toString());
    return this.http.get<ChartTotalResponse[]>(url, { params });
  }

  getTotalOrdersByMonth(month: number, year: number): Observable<number> {
    const url = `${this.apiBaseUrl}/orders/total-orders-by-month`;
    let params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get<number>(url, { params });
  }

  getTotalMoney(month: number, year: number): Observable<number> {
    const url = `${this.apiBaseUrl}/orders/totalMoney`;
    let params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get<number>(url, { params });
  }

  getProductAmountByCategory(): Observable<CategoryAmountResponse[]> {
    return this.http.get<CategoryAmountResponse[]>(`${this.apiBaseUrl}/products/productAmountByCategory`);
  }

}
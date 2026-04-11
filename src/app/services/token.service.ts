import {Inject, Injectable} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {LocalStorageService} from 'ngx-webstorage';
import {DOCUMENT} from "@angular/common";
@Injectable({
  providedIn: 'root'
})
export class TokenService{
   private readonly TOKEN_KEY = 'access_token';
  private jwtHelperService = new JwtHelperService();
  constructor() {

  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) ?? '';
  }
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUserId(): number {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return 0; // Trả về 0 nếu không tìm thấy dữ liệu user trong localStorage
      }
      console.log(userData);
      const userObject = JSON.parse(userData);
      return userObject.id || 0; // Trả về user_id hoặc 0 nếu không tìm thấy id trong dữ liệu user
  }


  isTokenExpired(): boolean {
    if(this.getToken() == null) {
      return false;
    }
    console.log(this.getToken());
    return this.jwtHelperService.isTokenExpired(this.getToken());
    // const token = this.getToken();
    //
    // // Kiểm tra nếu token không tồn tại
    // if (!token) {
    //   return false; // Token không tồn tại, trả về false
    // }
    // console.log(token);
    //
    // // Kiểm tra nếu token đã hết hạn
    // return this.jwtHelperService.isTokenExpired(token);
  }
}

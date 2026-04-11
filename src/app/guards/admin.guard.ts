import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { of,Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserResponse } from '../responses/user/user.response';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  userResponse?:UserResponse | null;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService:UserService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    // this.userResponse = this.userService.getUserResponseFromLocalStorage();
    // const isAdmin = this.userResponse?.role.name == 'admin';
   
    if ( isUserIdValid ) {

      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      // Kiểm tra xem người dùng có vai trò admin hay không
      const isAdmin = this.userResponse && this.userResponse.role.name === 'admin';

      if (isAdmin) {
        // Nếu là admin, cho phép truy cập
        return true;
      } else {
        // Nếu không phải admin, chuyển hướng đến trang chính hoặc trang không có quyền truy cập
        this.router.navigate(['/']);
        // Hoặc bạn có thể trả về một UrlTree khác để chuyển hướng
        // return this.router.parseUrl('/unauthorized');
        return false;
      }
    } else {
      // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
      // Ví dụ trả về trang login:
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  
  const adminGuard = inject(AdminGuard); // Không cần inject AdminGuard ở đây
  return adminGuard.canActivate(next, state);
}

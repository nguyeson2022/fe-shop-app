import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoginDTO} from "../../dtos/user/login.dto";
import {LoginResponse} from "../../responses/user/login.response";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {UserResponse} from "../../responses/user/user.response";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  // Login User
  // phoneNumber: string = '12345678';
  // password: string= '1234567';

  //Login Admin
  phone_number: string = '';
  password: string = '';

  roles: Role[] = []; //Manảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined;//Biến để lưu giá trịược chọn tuwf dropdown
  userResponse?: UserResponse
  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phone_number}`);
  }
  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.tokenService.getToken()) {
      this.router.navigate(['/']);
    }
  }

  createAccount() {
    
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }


  login(){

    const loginDTO: LoginDTO = {
      phone_number: this.phone_number,
      password: this.password,
      // role_id: this.selectedRole?.id ?? 1

    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        ;
        
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          ;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
                role: response.role || { id: 1, name: 'user' } // Đảm bảo luôn có role
              };
              console.log('User response after login:', this.userResponse);
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              this.toastr.success("Đăng nhập thành công", "Thành công", {
                timeOut: 2000
              });
              if(this.userResponse?.role.id == 2) {
                this.router.navigate(['/admin']);
              } else if(this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
              }

            },
            complete: () => {
              ;
            },
            error: (error: any) => {
              this.toastr.error("Số điện thoại hoặc mật khẩu của bạn sai!", "Thất bại", {
                timeOut: 2000
              });
            }
          })
        }
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        this.toastr.error("Số điện thoại hoặc mật khẩu của bạn sai!", "Thất bại", {
          timeOut: 2000
        });
      }
    });

  }


  showAlert(platform: string): void {
    alert(`${platform} đăng nhập chưa được hỗ trợ.`);
  }
}

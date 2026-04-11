import { Component, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';

import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'user-profile',
  templateUrl: './user.profile.component.html',
  styleUrls: ['./user.profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse;
  userProfileForm: FormGroup;
  token:string = '';
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private toastr: ToastrService
  ){
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      address: ['', [Validators.minLength(5)]],
      password: ['', [Validators.minLength(5)]],
      retype_password: ['', [Validators.minLength(5)]],
      date_of_birth: [Date.now()],
      email: ['', [Validators.minLength(5)]],
      phone_number: ['', [Validators.minLength(5)]],
    }, {
      validators: this.passwordMatchValidator// Custom validator function for password match
    });
  }

  ngOnInit(): void {
    
    this.token = <string>this.tokenService.getToken();
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          address: this.userResponse?.address ?? '',
          email: this.userResponse?.email ?? '',
          phone_number: this.userResponse?.phone_number ?? '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10),
        });
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        ;
        alert(error.error.message);
      }
    })
  }
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypedPassword = formGroup.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
  save(): void {
    
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        phone_number: this.userProfileForm.get('phone_number')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value,
        email:  this.userProfileForm.get('email')?.value,
      };

      this.userService.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            this.router.navigate(['/login']);
            this.toastr.success("Cập nhật người dùng thành công, Vui lòng đăng nhập lại", "Thành công", {
              timeOut: 2000
            });
          },
          error: (error: any) => {
            this.toastr.error("Cập nhật người dùng thất bại", "Thất bại", {
              timeOut: 2000
            });
          }
        });
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        alert('Mật khẩu và mật khẩu gõ lại chưa chính xác')
        this.toastr.warning("Mật khẩu và mật khẩu gõ lại chưa chính xác", "Lỗi đăng nhập", {
          timeOut: 2000
        });
      }
    }
  }
}


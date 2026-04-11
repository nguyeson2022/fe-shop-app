import {Component, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {RegisterDTO} from "../../dtos/user/register.dto"; //chuyen man hinh
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  // Khai báo các biến tường ứng voới caác trường dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  email: string;
  constructor(
    private readonly router: Router, 
    private readonly userService: UserService,
    private readonly toastr: ToastrService
  ) {
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
    this.email = '';

  }
  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  register(){
    if (this.registerForm.valid) {
      const registerDTO: RegisterDTO = {
        fullname: this.fullName,
        phone_number: this.phoneNumber,
        address: this.address,
        password: this.password,
        retype_password: this.retypePassword,
        date_of_birth: this.dateOfBirth,
        facebook_account_id: 0,
        email: this.email,
        role_id: 1
      };

      this.userService.register(registerDTO).subscribe({
        next: (response: any) => {
          this.toastr.success("Đăng ký thành công", "Thành công", {
            timeOut: 2000
          });
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error("Registration error:", error);
          this.toastr.error("Đăng ký thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    } else {
      this.toastr.error("Vui lòng kiểm tra lại thông tin đăng ký", "Lỗi", {
        timeOut: 2000
      });
    }

  }
  onDateOfBirthChange(){

  }

  //Check password match
  checkPasswordMatch(){
    if(this.password !== this.retypePassword){
      this.registerForm.form.controls['retypePassword'].setErrors({'passwordMismatch' : true});
    }else{
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
  checkAge(){
    if(this.dateOfBirth){
      const today= new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthBirth = today.getMonth() - birthDate.getMonth();
      if(monthBirth < 0 || (monthBirth === 0 && today.getDate() < birthDate.getDate())){
        age--;
      }
      if(age < 18){
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invalidAge': true});
      }else{
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }

}

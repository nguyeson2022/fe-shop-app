import {Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {InsertUserDto} from "../../../../dtos/user/insert.user.dto";
import {UserService} from "../../../../services/user.service";
import {NgForm} from "@angular/forms";
import {RegisterDTO} from "../../../../dtos/user/register.dto";

@Component({
  selector: 'app-insert.user.admin',
  templateUrl: './insert.user.admin.component.html',
  styleUrls: ['./insert.user.admin.component.css'],

})
export class InsertUserAdminComponent implements OnInit {
  @ViewChild('insertUserForm') insertUserForm!: NgForm;
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  email: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService

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
  ngOnInit() {

  }
  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  insertUser(){

    const registerDTO: RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "email": this.email,
      "role_id": 1
    }
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        
        this.toastr.success("Thêm người dùng thành công", "Thành công", {
          timeOut: 2000
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      complete: () => {
        
      },
      error: (error: any) => {

        this.toastr.error("Thêm người dùng thất bại" , "Thất bại", {
          timeOut: 2000
        });
      }
    })

  }
  checkPasswordMatch(){
    if(this.password !== this.retypePassword){
      this.insertUserForm.form.controls['retypePassword'].setErrors({'passwordMismatch' : true});
    }else{
      this.insertUserForm.form.controls['retypePassword'].setErrors(null);
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
        this.insertUserForm.form.controls['dateOfBirth'].setErrors({'invalidAge': true});
      }else{
        this.insertUserForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }

}

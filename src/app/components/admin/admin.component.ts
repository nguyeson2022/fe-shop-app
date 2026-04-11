import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { TokenService } from '../../services/token.service';
import {RouterModule} from "@angular/router";

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.scss',
  ],


})
export class AdminComponent implements OnInit {
  adminComponent: string = 'orders';
  userResponse?:UserResponse | null;
  private userService = inject(UserService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  isPopoverOpen = false;

  constructor(
  ){}

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    // Default router
    
    if (this.router.url === '/admin') {
      // sua duong dan hien thi trang dau tien
      this.router.navigate(['/admin/dashboard']);
    }
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //alert(`Clicked on "${index}"`);
    if(index === 0) {
      console.log(index)
      this.router.navigate(['/user-profile']);
    } else if (index === 1) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item
  }



  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.router.navigate(['/']);
  }
  showAdminComponent(componentName: string): void {
    
    if (componentName === 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products']);
    } else if (componentName === 'users') {
      this.router.navigate(['/admin/users']);
    }else if(componentName === 'product_images'){
      this.router.navigate(['/admin/product_images']);
    }
  }
}


/**
 npm install --save font-awesome
 angular.json:
 "styles": [
 "node_modules/font-awesome/css/font-awesome.min.css"
 ],
 */

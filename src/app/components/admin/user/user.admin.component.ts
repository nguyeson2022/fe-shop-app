import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserResponse } from '../../../responses/user/user.response';
import { DOCUMENT } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ApiResponse } from '../../../responses/api.response';
import {User} from "../../../models/user";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user.admin',
  templateUrl: './user.admin.component.html',
  styleUrl: './user.admin.component.scss',

})
export class UserAdminComponent implements OnInit{
  userService = inject(UserService);
  router = inject(Router)
  route = inject(ActivatedRoute);

  users: UserResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;

  constructor(
    //private location: Location,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentUserAdminPage')) || 1;
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchUsers() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.getUsers(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  getUsers(keyword: string, page: number, limit: number) {
    this.userService.getUsers({ keyword, page, limit }).subscribe({
      next: (response: any) => {
        
        const responses = response.data;
        this.users = responses.users;
        this.totalPages = responses.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        // Handle complete event
        
      },
      error: (error: any) => {
        
        console.error('Error fetching users:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentUserAdminPage', String(this.currentPage));
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  insertUser() {
    this.router.navigate(['/admin/users/insert']);
  }

  updateUser(userId: number) {
    this.router.navigate(['/admin/users/update', userId]);
  }
  resetPassword(userId: number) {
    this.userService.resetPassword(userId).subscribe({
      next: (response: any) => {
        const newPassword = response.data;
        this.toastr.success(`Reset mật khẩu thành công. Mật khẩu mới: ${newPassword}`, "Thành công", {
          timeOut: 5000
        });

      },
      complete: () => {
        // Handle complete event
      },
      error: (error: any) => {
        this.toastr.error("Reset mật khẩu thất bại", "Thất bại", {
          timeOut: 2000
        });
      }
    });
  }

  toggleUserStatus(user: UserResponse) {
    let confirmation: boolean;
    if (user.is_active) {
      confirmation = window.confirm('Bạn chắc chắn muốn xóa người dùng?');
    } else {
      confirmation = window.confirm('Are you sure you want to enable this user?');
    }

    if (confirmation) {
      const params = {
        userId: user.id,
        enable: !user.is_active
      };

      this.userService.toggleUserStatus(params).subscribe({
        next: (response: any) => {
          this.toastr.success("Xóa người dùng thành công", "Thành công", {
            timeOut: 2000
          });
          location.reload();
        },
        complete: () => {
        },
        error: (error: any) => {
          this.toastr.error("Cập nhật trạng thái thành công", "Thất bại", {
            timeOut: 2000
          });
          console.error('Error toggling user status:', error);
        }
      });
    }
  }
}

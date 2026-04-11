import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../environments/environment";
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: [
    './category.admin.component.scss',
  ]
})
export class CategoryAdminComponent implements OnInit {
  allCategories: Category[] = []; // Lưu toàn bộ danh sách
  categories: Category[] = []; // Danh sách hiển thị theo trang hiện tại
  currentPage: number = 1;
  itemsPerPage: number = 10; // Số item mỗi trang
  totalPages: number = 0;
  visiblePages: number[] = [];
  private localStorage?: Storage;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.currentPage = Number(this.localStorage?.getItem('currentCategoryAdminPage')) || 1;
    this.getCategories(this.currentPage, this.itemsPerPage);
  }

  getCategories(page: number, limit: number) {
    // Lấy toàn bộ danh sách categories
    this.categoryService.getCategories(0, 1000).subscribe({
      next: (response: any) => {
        // Lấy danh sách categories từ response
        let allCategories: Category[] = [];
        
        if (Array.isArray(response)) {
          allCategories = response;
        } else if (response && Array.isArray(response.categories)) {
          allCategories = response.categories;
        }
        
        // Cập nhật URL hình ảnh
        allCategories.forEach((category: Category) => {
          if (category.thumbnail) {
            category.url = `${environment.apiBaseUrl}/products/images/${category.thumbnail}`;
          } else {
            // Đặt ảnh mặc định nếu không có thumbnail
            category.url = 'assets/img/no-image-available.jpg';
          }
        });
        
        // Lưu toàn bộ danh sách
        this.allCategories = allCategories;
        
        // Tính toán phân trang
        this.totalPages = Math.ceil(allCategories.length / this.itemsPerPage);
        
        // Lấy danh sách cho trang hiện tại
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.categories = allCategories.slice(startIndex, endIndex);
        
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.localStorage?.setItem('currentCategoryAdminPage', String(this.currentPage));
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  onPageChange(page: number) {
    this.currentPage = page < 1 ? 1 : page;
    this.getCategories(this.currentPage, this.itemsPerPage);
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

  insertCategory() {
    this.router.navigate(['/admin/categories/insert']);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  updateCategory(categoryId: number) {
    
    this.router.navigate(['/admin/categories/update', categoryId.toString()]);
  }
  deleteCategory(category: Category) {
    const confirmation = window
      .confirm('Bạn chắc chắn muốn xóa danh mục?');
    if (confirmation) {
      
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: any) => {
          
          this.toastr.success("Xóa danh mục thành công", "Thành công", {
            timeOut: 2000
          });
          location.reload();
        },
        complete: () => {
          ;
        },
        error: (error: any) => {
          ;
          this.toastr.error("Xoá  danh mục thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    }
  }
}

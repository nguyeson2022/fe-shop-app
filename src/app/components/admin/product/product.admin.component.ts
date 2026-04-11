import { Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: [
    './product.admin.component.css',
  ],

})
export class ProductAdminComponent implements OnInit {
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  products: Product[] = [];
  // product?: Product;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;
  currentImageIndex: number = 0;

  private productService = inject(ProductService);
  private router = inject(Router);
  private location = inject(Location);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit() {
    this.currentPage = Number(this.localStorage?.getItem('currentProductAdminPage')) || 1;
    this.getProducts(this.keyword,
      this.selectedCategoryId,
      this.currentPage, this.itemsPerPage);
  }
  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    //Mediocre Iron Wallet
    
    this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        
        response.products.forEach((product: Product) => {
          if (product && product.product_images && product.product_images.length > 0) {
            product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
          }
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        ;
        console.error('Error fetching products:', error);
      }
    });
  }
  onPageChange(page: number) {
    ;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getThumbnail(product: Product):void {
    // Kiểm tra xem sản phẩm có product_images không
    if (product && product.product_images && product.product_images.length > 0) {
       product.product_images[0].image_url; // Lấy URL của hình ảnh đầu tiên từ product_images
    }
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

  // Hàm xử lý sự kiện khi thêm mới sản phẩm
  insertProduct() {
    
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/products/insert']);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  updateProduct(productId: number) {
    
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/products/update', productId]);
  }

  deleteProduct(product: Product) {
    const confirmation = window.confirm('Bạn chắc chắn muốn xóa sản phẩm?');
    if (confirmation) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.toastr.success("Xóa sản phẩm thành công", "Thành công", { timeOut: 2000 });
          // Sau khi xóa thành công, cập nhật danh sách sản phẩm mà không cần làm mới trang
          this.products = this.products.filter(p => p.id !== product.id);
        },
        error: () => {
          this.toastr.success("Xóa sản phẩm thành công", "Thành công", { timeOut: 2000 });
          // Sau khi xóa thành công, cập nhật danh sách sản phẩm mà không cần làm mới trang
          this.products = this.products.filter(p => p.id !== product.id);
        }
      });
    }
  }
  
}

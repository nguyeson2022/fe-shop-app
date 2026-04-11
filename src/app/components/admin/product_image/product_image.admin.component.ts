import { Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../../services/product.service';
import {ToastrService} from "ngx-toastr";
import {ProductImage} from "../../../models/product.image";
import {ProductImageService} from "../../../services/product_image.service";
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-image-admin',
  templateUrl: './product_image.admin.component.html',
  styleUrls: [
    './product_image.admin.component.css',
  ],

})
export class ProductImageAdminComponent implements OnInit {
  products: Product[] = [];
  selectedProductId: number  = 0;
  productImages: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;
  productImageId: number = 1;


  private productImageService = inject(ProductImageService);
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
    this.getProductImages(
      this.selectedProductId,
      this.currentPage, this.itemsPerPage);
    this.getProducts('', 0, 1, 100);
  }
  searchProductImages() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    //Mediocre Iron Wallet
    
    this.getProductImages(this.selectedProductId, this.currentPage, this.itemsPerPage);
  }
  getProductImages(selectedProductId: number, page: number, limit: number) {
    this.productImageService.getProductImages(selectedProductId, page, limit).subscribe({
      next: (response: any) => {
        let allImages: any[] = [];
        let productImages: ProductImage[] = response.productImages;

        productImages.forEach((productImage: ProductImage) => {
          if (productImage.image_url && productImage.productId) {
            let productData = {
              id: productImage.id,
              imageUrl: `${environment.apiBaseUrl}/products/images/${productImage.image_url}`,
              productName: productImage.productId
            };
            allImages.push(productData);
          }
        });

        // Lưu tất cả các dữ liệu sản phẩm vào biến productImages
        this.productImages = allImages;
        
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
  reloadPage() {
    window.location.reload();
  }

  getProducts( keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        
        this.products = response.products;
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

  getProductNameFromProductImage(productImage: any): string {
    // Kiểm tra xem có tồn tại thông tin về sản phẩm trong productImage không
    if (productImage && productImage.product) {
      // Sử dụng phương thức getName() để lấy tên của sản phẩm
      return productImage.product.name || ''; // Nếu không có tên sản phẩm, trả về chuỗi trống
    }
    return '';
  }
  onPageChange(page: number) {
    ;
    this.currentPage = page < 1 ? 1 : page;
    this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));
    this.getProductImages(this.selectedProductId, this.currentPage, this.itemsPerPage);
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
  insertImages() {
    
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/product_images/insert']);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  updateProduct(productId: number) {
    
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/products/update', productId]);
  }

  deleteImage(imageId: number) {
    if (confirm('Bạn chắc chắn muốn xóa hình ảnh?')) {
      this.productService.deleteProductImage(imageId).subscribe({
        next: () => {
          this.toastr.success("Xóa ảnh thành công", "Thành công", {
            timeOut: 2000
          });
          this.router.navigate(['/admin/product_images']);
          this.reloadPage();
        },
        error: (error) => {
          this.toastr.error("Xóa ảnh thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    }
  }





}

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Comment } from '../../../models/comment';
import { CommentService } from '../../../services/comment.service';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { Coupon, CouponCondition, InsertCoupon } from '../../../models/coupon';
import { CouponService } from '../../../services/coupon.service';


@Component({
  selector: 'app-coupon-admin',
  templateUrl: './coupon.admin.component.html',
  styleUrls: [
    './coupon.admin.component.scss',
  ]
})
export class CouponAdminComponent implements OnInit {
  coupons: Coupon[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  products: Product[] = [];

  constructor(
    private couponService: CouponService,
    private commentService: CommentService,
    private productService: ProductService,

    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getCoupons(this.currentPage, this.itemsPerPage);
  }


  reloadPage() {
    window.location.reload();
  }

  getCoupons(page: number, limit: number) {
    this.couponService.getCoupons(page, limit).subscribe({
      next: (response: any) => {
        
        this.coupons = response.data;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        console.error('Error fetching comment:', error);
      }
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.getCoupons( this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  updateCoupon(couponId: number) {
    this.router.navigate(['/admin/coupons/update', couponId]);
  }

  insertCoupon() {
    this.router.navigate(['/admin/coupons/insert']);
  }

  addCoupon() {
    this.router.navigate(['/admin/coupons/add']);
  }

  

  deleteCoupon(couponCondition: CouponCondition) {
    const confirmation = window
      .confirm('Bạn chắc chắn muốn xóa mã giảm giá?');

      if (confirmation) {
        
        this.couponService.deleteCouponCondition(couponCondition.id).subscribe({
          next: (response: any) => {
            this.toastr.success("Xóa mã giảm giá thành công", "Thành công", {
              timeOut: 2000
            });
            location.reload();
          },
          complete: () => {
            ;
          },
          error: (error: any) => {
            ;
            this.toastr.error("Xóa mã giảm giá thất bại", "Thất bại", {
              timeOut: 2000
            });
          }
        });
      }
    
  }


}
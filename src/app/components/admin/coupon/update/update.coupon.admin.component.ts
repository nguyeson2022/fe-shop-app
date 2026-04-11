import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import {ToastrService} from "ngx-toastr";
import { Coupon, CouponCondition, UpdateCouponCondition } from '../../../../models/coupon';
import { CouponService } from '../../../../services/coupon.service';


@Component({
  selector: 'app-detail.coupon.admin',
  templateUrl: './update.coupon.admin.component.html',
  styleUrls: ['./update.coupon.admin.component.css'],
})

export class UpdateCouponAdminComponent implements OnInit {
  conditionId: number;
  couponCondition: CouponCondition;
  updateCouponConditionData: UpdateCouponCondition;


  constructor(
    private couponService: CouponService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.conditionId = 0;
    this.couponCondition = {} as CouponCondition;
    this.updateCouponConditionData = {} as CouponCondition;
  }

  ngOnInit(): void {
    this.getCouponConditionDetails();
    
  }
  
  getCouponConditionDetails(): void {
    this.route.params.subscribe(params => {
      this.conditionId = params['id'];
      this.couponService.getCouponConditionById(this.conditionId).subscribe({
        next: (couponCondition: CouponCondition) => {
          this.couponCondition = couponCondition;
          this.updateCouponConditionData = { ...couponCondition };
        },
        error: (error: any) => {
          console.error('Error fetching coupon condition:', error);
        }
      });
    });
  }

  updateCouponCondition() {
    const updatedCouponConditionData: UpdateCouponCondition = {
      attribute: this.updateCouponConditionData.attribute,
      operator: this.updateCouponConditionData.operator,
      value: this.updateCouponConditionData.value,
      discountAmount: this.updateCouponConditionData.discountAmount,
      // Add other fields if necessary
    };

    this.couponService.updateCouponCondition(this.conditionId, updatedCouponConditionData).subscribe({
      next: (response: any) => {
        this.toastr.success('Cập nhật điều kiện coupon thành công', 'Thành công', {
          timeOut: 2000
        });
      },
      complete: () => {
        this.router.navigate(['/admin/coupons']);
      },
      error: (error: any) => {
        this.toastr.error('Cập nhật điều kiện coupon thất bại', 'Thất bại', {
          timeOut: 2000
        });
        console.error('Error updating coupon condition:', error);
      }
    });
  }
  
  

 
}

import {Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import { Coupon, InsertCouponCondition,  } from '../../../../models/coupon';
import { CouponService } from '../../../../services/coupon.service';

@Component({
  selector: 'app-insert.coupon.admin',
  templateUrl: './insert.coupon.admin.component.html',
  styleUrls: ['./insert.coupon.admin.component.css'],

})
export class InsertCouponAdminComponent implements OnInit {

    newCouponCondition: InsertCouponCondition = {
        coupon: {} as Coupon,
        attribute: '',
        operator: '',
        value: '',
        discountAmount: 0
      };
      coupons: Coupon[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private couponService: CouponService,
    private toastr: ToastrService

  ) {
    
  }
  ngOnInit() {
    this.loadCoupons();
  }


  loadCoupons() {
    this.couponService.getAllCoupons().subscribe({
      next: (coupons: Coupon[]) => {
        this.coupons = coupons;
      },
      error: (error: any) => {
        console.error('Error fetching coupons:', error);
      }
    });
  }


  addCouponCondition() {
    this.couponService.addCouponCondition(this.newCouponCondition).subscribe({
      next: (response: any) => {
        this.toastr.success('Thêm mới điều kiện mã thành công', 'Thành công', {
          timeOut: 2000
        });
        this.router.navigate(['/admin/coupons']);
      },
      error: (error: any) => {
        this.toastr.error('Thêm mới điều kiện mã thất bại', 'Thất bại', {
          timeOut: 2000
        });
        console.error('Error adding coupon condition:', error);
      }
    });
  }
  

}

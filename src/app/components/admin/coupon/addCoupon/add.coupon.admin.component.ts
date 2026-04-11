import {Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import { Coupon, InsertCoupon, InsertCouponCondition,  } from '../../../../models/coupon';
import { CouponService } from '../../../../services/coupon.service';

@Component({
  selector: 'app-add.coupon.admin',
  templateUrl: './add.coupon.admin.component.html',
  styleUrls: ['./add.coupon.admin.component.css'],

})
export class AddCouponAdminComponent implements OnInit {

    newCoupon: InsertCoupon = { code: '', active: true };
   
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private couponService: CouponService,
    private toastr: ToastrService

  ) {
    
  }
  ngOnInit() {
    
  }


  addCoupon() {
    this.couponService.addCoupon(this.newCoupon).subscribe(
      response => {
        this.toastr.success('Thêm mới mã giảm giá thành công', 'Thành công', {
          timeOut: 2000
        });
        this.router.navigate(['/admin/coupons']);
      },
      error => {
        this.toastr.error('Thêm mới mã giảm giá thất bại', 'Thất bại', {
          timeOut: 2000
        });
        console.error('Error adding coupon condition:', error);
      }
    );
  }
  

}

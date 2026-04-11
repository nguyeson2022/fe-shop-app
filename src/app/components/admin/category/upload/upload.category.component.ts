import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import {ToastrService} from "ngx-toastr";
import { Coupon, CouponCondition, UpdateCouponCondition } from '../../../../models/coupon';
import { CouponService } from '../../../../services/coupon.service';
import { ArticleService } from '../../../../services/article.service';
import { Article, UpdateArticle } from '../../../../models/article';
import { environment } from '../../../../environments/environment';
import { Category, UpdateCategory } from '../../../../models/category';


@Component({
  selector: 'app-detail.category.upload.admin',
  templateUrl: './upload.category.component.html',
  styleUrls: ['./upload.category.component.css'],
})

export class UploadCategoryAdminComponent implements OnInit {
  categoryId: number;
  category: UpdateCategory;
  updateCategory: UpdateCategory;
  currentImageIndex: number = 0;
  file: File | null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private toastr: ToastrService
  ) {
    this.categoryId = 0;
    this.category = {} as Category;
    this.updateCategory = {} as UpdateCategory;
    this.file = null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.categoryId = Number(params.get('id'));
        this.getCategoryDetails();
      });
  }

  getCategoryDetails(): void {
    this.categoryService.getDetailCategory(this.categoryId).subscribe({
        next: (category: UpdateCategory) => {
          this.category = category;
          this.updateCategory = { ...category };
          if (this.category.thumbnail) {
            this.category.thumbnail = `${environment.apiBaseUrl}/products/images/${this.category.thumbnail}`;
          }
        },
        error: (error: any) => {
          console.error('Error fetching article details:', error);
        }
      });
  }


//   showImage(index: number): void {
//     
//     if (this.article && this.article.thumbnail &&
//       this.article.thumbnail.length > 0) {
//       // Đảm bảo index nằm trong khoảng hợp lệ
//       if (index < 0) {
//         index = 0;
//       } else if (index >= this.article.thumbnail.length) {
//         index = this.article.thumbnail.length - 1;
//       }
//       // Gán index hiện tại và cập nhật ảnh hiển thị
//       this.currentImageIndex = index;
//     }
//   }
//   thumbnailClick(index: number) {
//     
//     // Gọi khi một thumbnail được bấm
//     this.currentImageIndex = index; // Cập nhật currentImageIndex
//   }
//   nextImage(): void {
//     
//     this.showImage(this.currentImageIndex + 1);
//   }

//   previousImage(): void {
//     
//     this.showImage(this.currentImageIndex - 1);
//   }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
    }
  }

  uploadThumbnail(): void {
    if (this.file !== null) {
      this.categoryService.uploadThumbnail(this.categoryId, this.file).subscribe({
        next: (response: any) => {
          this.toastr.success("Cập nhật ảnh thành công!", "Thành công", {
            timeOut: 2000
          });
          this.getCategoryDetails();
          this.router.navigate(['/admin/categories/update/', this.categoryId ]);
        },
        error: (error: any) => {
          this.toastr.error("Cập nhật ảnh thất bại!", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    }
  }



 
}

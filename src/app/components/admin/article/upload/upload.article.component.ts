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


@Component({
  selector: 'app-detail.article.upload.admin',
  templateUrl: './upload.article.component.html',
  styleUrls: ['./upload.article.component.css'],
})

export class UploadArticleAdminComponent implements OnInit {
  articleId: number;
  article: UpdateArticle;
  updateArticle: UpdateArticle;
  currentImageIndex: number = 0;
  file: File | null;

  constructor(
    private couponService: CouponService,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private toastr: ToastrService
  ) {
    this.articleId = 0;
    this.article = {} as Article;
    this.updateArticle = {} as UpdateArticle;
    this.file = null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.articleId = Number(params.get('id'));
        this.getArticleDetails();
      });
  }

  getArticleDetails(): void {
    this.articleService.getDetailArticle(this.articleId).subscribe({
        next: (article: UpdateArticle) => {
          this.article = article;
          this.updateArticle = { ...article };
          if (this.article.thumbnail) {
            this.article.thumbnail = `${environment.apiBaseUrl}/products/images/${this.article.thumbnail}`;
          }
        },
        error: (error: any) => {
          console.error('Error fetching article details:', error);
        }
      });
  }


  showImage(index: number): void {
    
    if (this.article && this.article.thumbnail &&
      this.article.thumbnail.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.article.thumbnail.length) {
        index = this.article.thumbnail.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    
    this.showImage(this.currentImageIndex - 1);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
    }
  }

  uploadThumbnail(): void {
    if (this.file !== null) {
      this.articleService.uploadThumbnail(this.articleId, this.file).subscribe({
        next: (response: any) => {
          this.toastr.success("Cập nhật ảnh thành công!", "Thành công", {
            timeOut: 2000
          });
          this.getArticleDetails();
          this.router.navigate(['/admin/articles/update/', this.articleId ]);
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

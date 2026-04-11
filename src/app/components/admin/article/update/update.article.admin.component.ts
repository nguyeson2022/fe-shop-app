import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService} from "ngx-toastr";
import { CouponService } from '../../../../services/coupon.service';
import { ArticleService } from '../../../../services/article.service';
import { Article, UpdateArticle } from '../../../../models/article';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-detail.article.admin',
  templateUrl: './update.article.admin.component.html',
  styleUrls: ['./update.article.admin.component.css'],
})

export class UpdateArticleAdminComponent implements OnInit {
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
          // if (this.article.thumbnail) {
          //   this.article.thumbnail = `${environment.apiBaseUrl}/products/images/${this.article.thumbnail}`;
          // }
        },
        error: (error: any) => {
          console.error('Error fetching article details:', error);
        }
      });
  }

  updateArticleData(): void {
    const updateArticleData: UpdateArticle = {
        title: this.updateArticle.title,
        author: this.updateArticle.author,
        description: this.updateArticle.description,
        created_at: this.updateArticle.created_at,
        thumbnail: this.updateArticle.thumbnail
      };
    this.articleService.updateArticle(this.articleId, this.updateArticle).subscribe({
      next: (response: any) => {
        this.toastr.success('Cập nhật bài viết thành công', 'Thành công', {
          timeOut: 2000
        });
        this.router.navigate(['/admin/articles']);
      },
      complete: () => {
        this.router.navigate(['/admin/articles']);
      },
      error: (error: any) => {
        this.toastr.success('Cập nhật bài viết thành công', 'Thành công', {
          timeOut: 2000
        });
        this.router.navigate(['/admin/articles']);
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

  navigateToUpdateImage(): void {
    this.router.navigate(['/admin/articles/upload/', this.articleId]);
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
          console.log('Thumbnail uploaded successfully:', response);
          // Reload article details to reflect the new thumbnail
          this.getArticleDetails();
        },
        error: (error: any) => {
          console.error('Error uploading thumbnail:', error);
        }
      });
    }
  }




  // onFileChange(event: any) {
  //   // Retrieve selected files from input element
  //   const files = event.target.files;
  //   // Limit the number of selected files to 5
  //   if (files.length > 4) {
  //     alert('Chỉ có thể chọn 1 ảnh');
  //     return;
  //   }
  //   // Store the selected files in the files array
  //   this.files = files;
  //   this.articleService.uploadImages(this.articleId, this.files).subscribe({
  //     next: (imageResponse) => {
  //       // Handle the uploaded images response if needed
  //       console.log('Images uploaded successfully:', imageResponse);
  //       this.files = [];
  //       // Reload article details to reflect the new images
  //       this.getArticleDetails();
  //     },
  //     error: (error) => {
  //       // Handle the error while uploading images
  //       console.error('Error uploading images:', error);
  //       // Log the success message from the server
  //       console.log(error.error);
  //     }
  //   })
  // }


  // deleteImage(productImage: ProductImage) {
  //   if (confirm('Are you sure you want to remove this image?')) {
  //     // Call the removeImage() method to remove the image
  //     this.productService.deleteProductImage(productImage.id).subscribe({
  //       next:(productImage: ProductImage) => {
  //         // location.reload();
  //         console.log(productImage);
  //       },
  //       error: (error) => {
  //         // Handle the error while uploading images
  //         alert(error.error)
  //         console.error('Error deleting images:', error);
  //       }
  //     });
  //   }
  // }

 
}

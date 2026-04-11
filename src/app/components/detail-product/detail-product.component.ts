import { Component, OnInit } from '@angular/core';
import { Product } from "../../models/product";
import { ProductService } from "../../services/product.service";
import { environment } from "../../environments/environment";
import { ProductImage } from "../../models/product.image";
import { CartService } from "../../services/cart.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Comment } from '../../models/comment';
import { CommentDTO } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { ToastrService } from "ngx-toastr";
// import '../../styles/nouislider.min.js';
// import '../../styles/jquery.min.js';
// import '../../styles/jquery.zoom.min.js';
// import '../../styles/slick.min.js';
@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css',
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  comments: Comment[] = [];
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;
  reviewContent: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private router: Router,
    private toastr: ToastrService
  ) { }
  ngOnInit() {


    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          //Lay danh sach san pham vaf thay doi url
          if (response.product_images && response.product_images.length > 0) {
            response.product_images?.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          
          this.product = response
          //Bat dau voi anh dau tien
          this.showImage(0);
        },
        complete: () => {
          ;
        },
        error: (error: any) => {
          ;
          console.error('Error fetching detail:', error);
        }
      });

      this.getCommentProducts(this.productId, this.currentPage, this.itemsPerPage);
    } else {
      console.log('Invalid productId: ', idParam);
    }
  }
  showImage(index: number): void {
    
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }

      //Gan index hien tai va cap nhat anh hien tai
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    
    //Goi khi mot thmbnail duoc bam
    this.currentImageIndex = index;
  }
  nextImage(): void {
    
    this.showImage(this.currentImageIndex + 1);
  }
  previousImage(): void {
    
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      // xu ly khi product la null
      console.error('Khong the them san pham vao gio hang vi product null');
    }
  }

  increateQuantity(): void {
    this.quantity++;
  }
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow() {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
    window.scrollTo(0, 0); 
  }

  submitReview(): void {
    if (!this.reviewContent.trim()) {
      console.error('Review content is empty');
      return;
    }

    const userData = localStorage.getItem('user');
    let user_id: number = 0;

    if (userData) {
      const user = JSON.parse(userData);
      user_id = user.id;
      console.log(user_id);

      const commentDTO: CommentDTO = {
        product_id: this.productId,
        user_id: user_id,
        content: this.reviewContent
      };

      this.commentService.insertComment(commentDTO).subscribe({
        next: (response: any) => {
          this.toastr.success("Đánh giá sản phẩm thành công", "Thành công", {
            timeOut: 2000
          });
          location.reload();
        },
        error: (error: any) => {
          this.toastr.error("Đánh giá sản phẩm thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });

    } else {
      console.error('No user data found in localStorage');
    }
    // Clear review content after submission
    this.reviewContent = '';
  }

  getCommentProducts(productId: number, page: number, limit: number) {
    this.commentService.getComments(productId, page, limit).subscribe({
      next: (response: any) => {
        
        this.comments = response.comments;
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
    this.getCommentProducts(this.productId, this.currentPage, this.itemsPerPage);
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



}

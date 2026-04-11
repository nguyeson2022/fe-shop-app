import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Comment } from '../../../models/comment';
import { CommentService } from '../../../services/comment.service';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { ModalService } from '../../../services/modal.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCommentAdminComponent } from './update/update.comment.admin.component';
import { DeleteConfirmationDialogComponent } from './delete/delete.confirm.dialog.component';


@Component({
  selector: 'app-commnet-admin',
  templateUrl: './comment.admin.component.html',
  styleUrls: [
    './comment.admin.component.scss',
  ]
})
export class CommentAdminComponent implements OnInit {
  comments: Comment[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  productId: number = 0;
  products: Product[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  selectedComment: Comment | null = null;
  constructor(
    private commentService: CommentService,
    private productService: ProductService,
    private modalService: ModalService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getCommentProducts(this.productId, this.currentPage, this.itemsPerPage)
    this.getProducts(this.keyword, this.selectedCategoryId, 1, 100);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    
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

  onProductSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const productId = target.value;
      if (productId) {
        // Fetch comments for the selected product
        this.getCommentProducts(+productId, this.currentPage, this.itemsPerPage);
      }
    }
  }

  reloadPage() {
    window.location.reload();
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

  updateComment(commentId: number) {
    this.router.navigate(['/admin/comments/update', commentId]);
  }

  deleteComment(comment: Comment) {
    const confirmation = window
      .confirm('Bạn chắc chắn muốn xóa đánh giá?');

      if (confirmation) {
        
        this.commentService.deleteComment(comment.id).subscribe({
          next: (response: any) => {
            this.toastr.success("Xóa đánh giá thành công", "Thành công", {
              timeOut: 2000
            });
            location.reload();
          },
          complete: () => {
            ;
          },
          error: (error: any) => {
            ;
            this.toastr.error("Xóa đánh giá thất bại", "Thất bại", {
              timeOut: 2000
            });
            console.error('Error fetching products:', error);
          }
        });
      }
    
  }


}
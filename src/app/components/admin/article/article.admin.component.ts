import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import { ArticleService } from '../../../services/article.service';
import { Article } from '../../../models/article';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-article-admin',
  templateUrl: './article.admin.component.html',
  styleUrls: [
    './article.admin.component.scss',
  ]
})
export class ArticleAdminComponent implements OnInit {
    articles: Article[] = [];
    currentPage: number = 0;
    itemsPerPage: number = 8;
    pages: number[] = [];
    totalPages:number = 0;
    visiblePages: number[] = [];
  constructor(
    private articleService: ArticleService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    
    // this.currentPage = Number(localStorage.getItem('currentOrderAdminPage')) || 0;
    this.getArticles(1, this.itemsPerPage);
  }
  getArticles(page: number, limit: number) {
    this.articleService.getArticles(page, limit).subscribe({
      next: (response: any) => {
        response.articles.forEach((article: Article) => {
          article.url = `${environment.apiBaseUrl}/products/images/${article.thumbnail}`;
        });
        this.articles = response.articles;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        console.log('Fetching articles completed.');
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getArticles(this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  insertArticle() {
    this.router.navigate(['/admin/articles/insert']);
  }

 
  updateArticle(articleId: number) {
    this.router.navigate(['/admin/articles/update', articleId.toString()]);
  }

  deleteArticle(article: Article) {
    const confirmation = window.confirm('Bạn chắc chắn muốn xóa bài viết?');
    if (confirmation) {
      this.articleService.deleteArticle(article.id).subscribe({
        next: () => {
          this.toastr.success("Xóa bài viết thành công", "Thành công", { timeOut: 2000 });
          this.router.navigate(['/admin/articles']);
        },
        error: () => {
          this.toastr.success("Xóa bài viết thành công", "Thành công", { timeOut: 2000 });
          this.router.navigate(['/admin/articles']);
          location.reload();
        }
      });
    }
  }
}

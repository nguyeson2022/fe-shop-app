import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  article?: Article;
  articleId: number = 0;
  articles: Article[] = [];
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;
  categories: Category[] = [];
  isDetailView: boolean = false;
  
  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.articleId = +idParam;
        this.isDetailView = true;
        this.getArticleDetail(this.articleId);
      } else {
        this.isDetailView = false;
        this.getArticles(1, 10); // Load more articles for the list view
      }
    });
    
    // Always load categories and recent articles
    this.getCategories(0, 6);
    this.getRecentArticles(1, 4);
  }

  getArticleDetail(id: number): void {
    this.articleService.getDetailArticle(id).subscribe({
      next: (response: any) => {
        if (response) {
          this.article = response; 
          // response.articles.forEach((article: Article) => {
          //   article.url = `${environment.apiBaseUrl}/products/images/${article.thumbnail}`;
          // });
          if (this.article) {
            this.article.url = `${environment.apiBaseUrl}/products/images/${this.article.thumbnail}`;
          } else {
            console.error('Article is undefined.');
          }
        } else {
          console.error('No article found in the response');
        }
      },
      error: (error: any) => {
        console.error('Error fetching article detail:', error);
      }
    });
  }

  // Get articles for the list view
  getArticles(page: number, limit: number) {
    this.articleService.getArticles(page, limit).subscribe({
      next: (response: any) => {
        response.articles.forEach((article: Article) => {
          article.url = `${environment.apiBaseUrl}/products/images/${article.thumbnail}`;
        });
        this.articles = response.articles;
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
      }
    });
  }

  // Get recent articles for the sidebar
  getRecentArticles(page: number, limit: number) {
    this.articleService.getArticles(page, limit).subscribe({
      next: (response: any) => {
        response.articles.forEach((article: Article) => {
          article.url = `${environment.apiBaseUrl}/products/images/${article.thumbnail}`;
        });
        // Only update the recent articles, not the main articles list
        if (!this.isDetailView) {
          this.articles = response.articles;
        }
      },
      error: (error) => {
        console.error('Error fetching recent articles:', error);
      }
    });
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        
        this.categories = categories;
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  // Navigate to article detail
  navigateToArticleDetail(articleId: number): void {
    this.router.navigate(['/articles', articleId]);
  }

  // Handle click on article in the list
  onArticleClick(articleId: number): void {
    this.navigateToArticleDetail(articleId);
  }

  // Handle thumbnail click
  thumbnailClick(index: number): void {
    this.currentImageIndex = index;
  }
}

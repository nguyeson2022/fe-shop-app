import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface CategoryProducts {
  category: Category;
  products: Product[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  productsByCategory: CategoryProducts[] = [];
  categories: Category[] = [];
  articles: Article[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  itemsPerPageArticle: number = 3;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  isLoading: boolean = true;
  numberOfProducts: number = 0;
  // #currentCategoryIndex: number = 0; // dùng để kiểm tra xem đã lên hết sản phẩm hay chưa


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private articleService: ArticleService,
    private router: Router
  ) { }

  async ngOnInit() {
    // await this.getTotalCategory();
    await this.getCategories(1, 100);
    await this.getProductsByCategory();
    this.getArticles(1, this.itemsPerPageArticle);
  }


  // getTotalCategory(): Promise<number> {
  //   return new Promise((resolve, reject) => {
  //     this.categoryService.getTotalCategories().subscribe({
  //       next: (total: number) => {
  //         this.#totalCategories = total;
  //         resolve(total);
  //       },
  //       error: (error: any) => {
  //         console.error('Error fetching total categories:', error);
  //         reject(error);
  //       }
  //     });
  //   });
  // }

  getCategories(page: number, limit: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getCategories(page, limit).subscribe({
        next: (categories: Category[]) => {
          this.categories = categories;
          resolve();
        },
        error: (error: any) => {
          console.error('Error fetching categories:', error);
          reject(error);
        }
      });
    });
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
      error: (error) => {
        console.error('Error fetching articles:', error);
      }
    });
  }

  getMoreProducts() {

    // this.productsByCategory = [];
    const categoryRequests = this.categories.slice(this.numberOfProducts, this.numberOfProducts + 4).map(category =>
      this.productService.getProducts('', category.id, 1, 4).pipe(
        map(response => {
          const products = response.products || [];
          console.log(`Products for category ${category.name}:`, products);
          return {
            category,
            products: this.processProducts(products)
          };
        }),
        catchError(error => {
          console.error(`Error fetching products for category ${category.name}:`, error);
          return of(null);
        })
      )
    );
    this.numberOfProducts += 4;

    // lấy sản phẩm ngẫu nhiên
    // const uncategorizedRequest = this.productService.getProducts('', 0, 1, 4).pipe(
    //   map(response => {
    //     const products = response.products || [];
    //     console.log('All products:', products);
    //     return {
    //       category: { id: 0, name: 'Tất cả sản phẩm' } as Category,
    //       products: this.processProducts(products)
    //     };
    //   }),
    //   catchError(error => {
    //     console.error('Error fetching all products:', error);
    //     return of(null);
    //   })
    // );

    // Combine all requests
    const allRequests = [...categoryRequests
      // , uncategorizedRequest
    ];

    // Execute all requests in parallel
    forkJoin(allRequests).subscribe({
      next: (results: any[]) => {
        // Filter out failed requests and empty results
        const validResults: CategoryProducts[] = results.filter(result =>
          result !== null &&
          result.products &&
          result.products.length > 0
        );

        console.log('Products by category:', validResults);
        this.productsByCategory.push(...validResults);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in getProductsByCategory:', error);
        this.isLoading = false;
      }
    });
  }

  getProductsByCategory() {
    this.isLoading = true;
    // this.productsByCategory = [];
    const categoryRequests = this.categories.slice(this.numberOfProducts, this.numberOfProducts + 4).map(category =>
      this.productService.getProducts('', category.id, 1, 4).pipe(
        map(response => {
          const products = response.products || [];
          console.log(`Products for category ${category.name}:`, products);
          return {
            category,
            products: this.processProducts(products)
          };
        }),
        catchError(error => {
          console.error(`Error fetching products for category ${category.name}:`, error);
          return of(null);
        })
      )
    );
    this.numberOfProducts += 4;

    // lấy sản phẩm ngẫu nhiên
    // const uncategorizedRequest = this.productService.getProducts('', 0, 1, 4).pipe(
    //   map(response => {
    //     const products = response.products || [];
    //     console.log('All products:', products);
    //     return {
    //       category: { id: 0, name: 'Tất cả sản phẩm' } as Category,
    //       products: this.processProducts(products)
    //     };
    //   }),
    //   catchError(error => {
    //     console.error('Error fetching all products:', error);
    //     return of(null);
    //   })
    // );

    // Combine all requests
    const allRequests = [...categoryRequests
      // , uncategorizedRequest
    ];

    // Execute all requests in parallel
    forkJoin(allRequests).subscribe({
      next: (results: any[]) => {
        // Filter out failed requests and empty results
        const validResults: CategoryProducts[] = results.filter(result =>
          result !== null &&
          result.products &&
          result.products.length > 0
        );

        console.log('Products by category:', validResults);
        this.productsByCategory.push(...validResults);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in getProductsByCategory:', error);
        this.isLoading = false;
      }
    });
  }

  private processProducts(products: any[]): Product[] {
    if (!Array.isArray(products)) {
      console.warn('Expected an array of products but got:', products);
      return [];
    }

    return products.map(product => {
      // Process product images
      let imageUrl = 'assets/images/placeholder.jpg';

      if (product.thumbnail) {
        imageUrl = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
      } else if (product.product_images && product.product_images.length > 0) {
        // Use the first product image if available
        imageUrl = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
      }

      return {
        ...product,
        url: imageUrl,
        // Ensure category_name is set
        category_name: product.category_name || this.getCategoryName(product.category_id)
      };
    });
  }

  private getCategoryName(categoryId: number | string): string {
    if (!categoryId) return 'Khác';

    const category = this.categories.find(cat =>
      cat.id === categoryId || cat.id.toString() === categoryId.toString()
    );

    return category ? category.name : 'Khác';
  }

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
    window.scrollTo(0, 0);
  }

  addToWishlist(product: Product) {
    // TODO: Implement add to wishlist functionality
    console.log('Adding to wishlist:', product);
    // You can add your wishlist service call here
  }

  addToCart(product: Product) {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
    // You can add your cart service call here
  }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.getProductsByCategory();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getProductsByCategory();
  }

  onPageChangeArticle(page: number) {
    this.currentPage = page;
    this.getArticles(this.currentPage, this.itemsPerPageArticle);
  }

  onArticleClick(articleId: number) {
    this.router.navigate(['/articles', articleId]);
    window.scrollTo(0, 0);
  }

  onCategoryClick(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.getProductsByCategory();
  }

  onClickAll() {
    this.router.navigate(['/product-list']);
    window.scrollTo(0, 0);
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
}
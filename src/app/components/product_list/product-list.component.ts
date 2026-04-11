import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {CartService} from "../../services/cart.service";
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  product?: Product;
  keyword: string = '';
  selectedCategoryId: number | string = 0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  visiblePages: number[] = [];
  quantity: number = 1;
  isPressedAddToCart:boolean = false;
  categories: Category[] = []; 
  newestProducts: Product[] = [];
  productId: number = 0;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCategories(0, 10);
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = +idParam;
    }
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      // Handle categoryId as string or number
      const categoryId = params['categoryId'];
      this.selectedCategoryId = categoryId !== undefined 
        ? (typeof categoryId === 'string' && !isNaN(Number(categoryId)) ? Number(categoryId) : categoryId)
        : 0;
      this.currentPage = +params['page'] || 1;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    });
    if (this.newestProducts.length === 0) {
      this.getNewestProducts();
    }
  }

  getProducts(keyword: string, selectedCategoryId: number | string, page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        
        // Extract products and totalPages from the response
        const products = response.products || [];
        this.totalPages = response.totalPages || 1;
        
        // Process product images and category names
        products.forEach((product: Product) => {
          // Set the category name
          if (typeof product.category_id === 'string') {
            product.category_name = product.category_id;
          } else if (this.categories && this.categories.length > 0) {
            const category = this.categories.find(cat => cat.id === product.category_id);
            product.category_name = category ? category.name : 'Khác';
          }
          
          // Set the product image URL
          if (product && product.product_images && product.product_images.length > 0) {
            product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
          } else if (product.thumbnail) {
            // Fallback to thumbnail if no product images
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          } else {
            // Fallback to a default image if no image is available
            product.url = 'assets/img/default-product.png';
          }
        });
        
        this.products = products;
        
        // Generate visible pages for pagination after we have all the data
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        
        console.log('Processed products:', this.products);
        console.log('Total pages:', this.totalPages);
        console.log('Visible pages:', this.visiblePages);
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  searchProducts() {
    this.currentPage = 1;
    // Ensure selectedCategoryId is a number
    const categoryId = typeof this.selectedCategoryId === 'string' 
      ? parseInt(this.selectedCategoryId, 10) || 0 
      : this.selectedCategoryId;
    this.getProducts(this.keyword, categoryId, this.currentPage, this.itemsPerPage);
  }

  onCategoryChange() {
    // Ensure selectedCategoryId is a number
    if (typeof this.selectedCategoryId === 'string') {
      this.selectedCategoryId = parseInt(this.selectedCategoryId, 10) || 0;
    }
    this.searchProducts();
  }
  onCategoryChangeId(categoryId: number | string) {
    // Ensure categoryId is a number
    const id = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
    this.selectedCategoryId = isNaN(id) ? 0 : id;
    this.currentPage = 1;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  onSearch(): void {
    // Ensure selectedCategoryId is properly formatted for the URL
    const categoryId = this.selectedCategoryId !== 0 && this.selectedCategoryId !== '0' 
      ? this.selectedCategoryId 
      : null;

    this.router.navigate(['/product-list'], {
      queryParams: {
        keyword: this.keyword || null,
        categoryId: categoryId,
        page: 1 // Reset to first page on new search
      },
      queryParamsHandling: 'merge' // Preserve other query params
    });
  }
  onProductClick(productId: number){
    
    this.router.navigate(['/products', productId]);
    window.scrollTo(0, 0); 
  }

  addToCart(product: Product): void {
    this.isPressedAddToCart = true;
    if (product) {
      this.cartService.addToCart(product.id, this.quantity, product.name);
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product null');
      this.cartService.addToCart(0, 0, 'sản phẩm'); // Fallback in case product is null
    }
  }
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    console.log('Generating visible pages array. Current page:', currentPage, 'Total pages:', totalPages);
    
    if (totalPages <= 1) {
      console.log('Total pages is less than or equal to 1, returning empty array');
      return [];
    }

    const maxVisiblePages = 5; // Maximum number of page numbers to show
    const pages: number[] = [];
    
    // Always show first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) {
        pages.push(-1); // Ellipsis
      }
    }
    
    // Calculate start and end page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Adjust if we're at the start or end
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(-1); // Ellipsis
      }
      pages.push(totalPages);
    } else if (endPage === totalPages - 1) {
      pages.push(totalPages);
    }
    
    console.log('Generated pages array:', pages);
    return pages;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    
    // Update URL with new page number
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page > 1 ? page : null },
      queryParamsHandling: 'merge'
    });
    
    // Load products for the new page
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  buyNow(product: Product){
    if(this.isPressedAddToCart == false) {
      this.addToCart(product);
    }
    this.router.navigate(['/orders']);
    window.scrollTo(0, 0); 
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

  getNewestProducts(): void {
    this.productService.getNewestProducts(5).subscribe({
      next: (response) => {
        const products = response.products || [];
        
        // Process product images
        products.forEach((product: Product) => {
          if (product.thumbnail) {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          } else if (product.product_images && product.product_images.length > 0) {
            product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
          } else {
            product.url = 'assets/img/default-product.png';
          }
          
          // Set category name if not already set
          if (!product.category_name) {
            product.category_name = this.getCategoryName(product.category_id);
          }
        });
        
        this.newestProducts = products;
      },
      error: (error) => {
        console.error('Error fetching newest products:', error);
        this.newestProducts = [];
      }
    });
  }

  // Get category name by category ID
  getCategoryName(categoryId: number | string): string {
    if (typeof categoryId === 'string') {
      return categoryId; // Return the string directly if it's already a category name
    }
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không xác định';
  }
}

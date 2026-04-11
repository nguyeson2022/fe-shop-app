import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../environments/environment';
import { ProductImage } from '../../../../models/product.image';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import { ToastrService } from "ngx-toastr";

// Extend the Product interface to include the category property
interface ProductWithCategory extends Product {
  category?: {
    id: number | string;
    name: string;
  };
}


@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.css', './update.product.admin.component.scss'],
})

export class UpdateProductAdminComponent implements OnInit {
  productId: number;
  product: ProductWithCategory;
  updatedProduct: ProductWithCategory;
  categories: Category[] = []; // Dữ liệu động từ categoryService
  currentImageIndex: number = 0;
  images: File[] = [];
  selectedCategoryId: number = 0; // Mặc định là 0 thay vì null

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.productId = 0;
    this.product = {} as ProductWithCategory;
    this.updatedProduct = {} as ProductWithCategory;
  }
  
  // Helper method to get full image URL
  private getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiBaseUrl}/products/images/${imagePath}`;
  }

  // Handle category selection change
  onCategoryChange(event: any): void {
    const categoryId = Number(event?.target?.value);
    if (isNaN(categoryId)) return;
    
    this.selectedCategoryId = categoryId;
    this.updatedProduct = {
      ...this.updatedProduct,
      category_id: categoryId
    };
    
    console.log('Category changed to:', categoryId, 'Updated product:', this.updatedProduct);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      // Load categories first, then product details
      this.getCategories(1, 100, () => {
        this.getProductDetails();
      });
    });
  }
  getCategories(page: number, limit: number, callback?: () => void) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories);
        if (callback) callback();
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
        this.toastr.error('Không thể tải danh sách thể loại', 'Lỗi');
        if (callback) callback();
      }
    });
  }
  getProductDetails(): void {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response);
        
        // Handle API response structure (check if data exists in response)
        const productData = response.data || response;
        
        // Create a deep copy of the product
        this.product = {...productData};
        this.updatedProduct = {...productData};
        
        // Handle category assignment
        const categoryId = productData.category?.id || productData.category_id;
        console.log('Product category ID:', categoryId, 'Type:', typeof categoryId);
        
        if (categoryId) {
          // Nếu category_id là tên category, tìm ID tương ứng
          if (typeof categoryId === 'string' && isNaN(Number(categoryId))) {
            console.log('Category ID is a string, looking up by name:', categoryId);
            const category = this.categories.find(cat => 
              cat.name.toLowerCase() === categoryId.toLowerCase()
            );
            
            if (category) {
              this.selectedCategoryId = Number(category.id);
              console.log('Found matching category by name:', category);
            } else {
              console.warn(`Category '${categoryId}' not found in available categories`);
              this.selectedCategoryId = 0; // Sử dụng 0 làm giá trị mặc định
            }
          } else {
            // Nếu category_id là số
            const numCategoryId = Number(categoryId);
            this.selectedCategoryId = numCategoryId;
            
            // Kiểm tra xem category có tồn tại không
            const category = this.categories.find(cat => Number(cat.id) === numCategoryId);
            if (category) {
              console.log('Found matching category by ID:', category);
            } else {
              console.warn(`Category ID ${numCategoryId} not found in available categories`);
            }
          }
          
          // Cập nhật category_id trong updatedProduct
          this.updatedProduct.category_id = this.selectedCategoryId || 0; // Mặc định là 0 nếu không có category
          console.log('Final selectedCategoryId:', this.selectedCategoryId);
        }
        
        console.log('Processed product:', this.product);
        console.log('Selected Category ID:', this.selectedCategoryId, 'Type:', typeof this.selectedCategoryId);
        
        // Process product images
        if (this.product.product_images && this.product.product_images.length > 0) {
          this.product.product_images = this.product.product_images.map((img: any) => ({
            ...img,
            image_url: this.getFullImageUrl(img.image_url)
          }));
          
          // Also update the updatedProduct images
          this.updatedProduct.product_images = [...this.product.product_images];
        }
        
        console.log('Product images:', this.product.product_images);
        
        // Force change detection
        this.product = {...this.product};
        this.updatedProduct = {...this.updatedProduct};
      },
      complete: () => {
        console.log('Product details loaded');
      },
      error: (error: any) => {
        console.error('Error loading product details:', error);
        this.toastr.error('Không thể tải thông tin sản phẩm', 'Lỗi');
      }
    });
  }
  updateProduct() {
    // Ensure a category is selected
    if (!this.selectedCategoryId) {
      this.toastr.error("Vui lòng chọn thể loại sản phẩm", "Lỗi", {
        timeOut: 2000
      });
      return;
    }

    // Prepare the update data
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: Number(this.updatedProduct.price),
      description: this.updatedProduct.description,
      category_id: this.selectedCategoryId,
      stock: this.updatedProduct.stock !== undefined ? Number(this.updatedProduct.stock) : 0 // Ensure stock is a number, default to 0 if undefined
    };

    console.log('Sending update request with data:', updateProductDTO);

    // Show loading indicator
    this.toastr.info('Đang cập nhật sản phẩm...', 'Vui lòng đợi', {
      timeOut: 2000
    });

    // Call the update service
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: (response: any) => {
        this.toastr.success("Cập nhật sản phẩm thành công", "Thành công", {
          timeOut: 2000
        });
      },
      complete: () => {
        // Navigate back to product list after a short delay
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1000);
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        let errorMessage = "Cập nhật sản phẩm thất bại";
        
        // Provide more specific error messages if available
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = "Bạn cần đăng nhập để thực hiện thao tác này";
        } else if (error.status === 403) {
          errorMessage = "Bạn không có quyền thực hiện thao tác này";
        }
        
        this.toastr.error(errorMessage, "Lỗi", {
          timeOut: 3000
        });
      }
    });
  }
  showImage(index: number): void {
    
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  // TrackBy function for ngFor to improve performance
  trackByImage(index: number, item: any): number {
    return item.id || index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    
    this.showImage(this.currentImageIndex - 1);
  }
  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 4) {
      alert('Chỉ có thể chọn tối đa 4 ảnh');
      return;
    }
    // Store the selected files in the newProduct object
    this.images = files;
    this.productService.uploadImages(this.productId, this.images).subscribe({
      next: (imageResponse) => {
        
        // Handle the uploaded images response if needed
        console.log('Images uploaded successfully:', imageResponse);
        this.images = [];
        // Reload product details to reflect the new images
        this.getProductDetails();
      },
      error: (error) => {
        // Handle the error while uploading images
        alert(error.error)
        console.error('Error uploading images:', error);
      }
    })
  }
  deleteImage(productImage: ProductImage) {
    if (confirm('Bạn chắc chắn muốn xóa hình ảnh trên?')) {
      // Call the removeImage() method to remove the image
      this.productService.deleteProductImage(productImage.id).subscribe({
        next:(productImage: ProductImage) => {
          // location.reload();
          console.log(productImage);
          this.getProductDetails();
        },
        error: (error) => {
          // Handle the error while uploading images
          alert(error.error)
          console.error('Error deleting images:', error);
        }
      });
    }
  }
}

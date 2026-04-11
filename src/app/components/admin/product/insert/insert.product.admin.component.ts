import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertProductDTO } from '../../../../dtos/product/insert.product.dto';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ProductService } from '../../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../responses/api.response';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss'],

})
export class InsertProductAdminComponent implements OnInit {
  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0,
    importPrice: 0,
    description: '',
    thumbnail: '',
    category_id: 1,
    images: [],
    stock: 0 // Default stock value
  };
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {

  }
  ngOnInit() {
    this.getCategories(1, 100)
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        ;
        this.categories = categories;
        console.log(this.categories);
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 3) {
      alert('Please select a maximum of 5 images.');
      return;
    }else{
      if (files && files.length > 0) {
        // Lặp qua từng tệp đã chọn và lấy tên của nó
        for (let i = 0; i < files.length; i++) {
          const fileName: string = files[i].name; // Lấy tên của tệp
          console.log("Selected file name:", fileName);

          // Thêm tên của tệp vào mảng tên ảnh trong insertProductDTO
          this.insertProductDTO.images.push(files[i]);
        }
      }
    }
    // Store the selected files in the newProduct object

  }

  insertProduct() {
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (response) => {
        
        if (this.insertProductDTO.images.length > 0) {
          const productId = response.id; // Assuming the response contains the newly created product's ID
          this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
            next: (imageResponse) => {
              
              // Handle the uploaded images response if needed
              this.toastr.success("Thêm sản phẩm thành công", "Thành công", {
                timeOut: 2000
              });
              this.router.navigate(['/admin/products'], { relativeTo: this.route });
            },
            error: (error) => {
              this.toastr.error("Thêm sản phẩm thất bại", "Thất bại", {
                timeOut: 2000
              });
              console.error('Error uploading images:', error);
            }
          })
        }
      },
      error: (error) => {
        
        // Handle error while inserting the product
        alert(error.error)
        console.error('Error inserting product:', error);
      }
    });
  }
  trackCategory(index: number, category: any): any {
    return category ? category.id : undefined;
  }
}

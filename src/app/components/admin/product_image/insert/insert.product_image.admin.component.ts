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
import {InsertProductImageDTO} from "../../../../dtos/product_images/insert.product_image.dto";
import {Product} from "../../../../models/product";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-insert.product_image.admin',
  templateUrl: './insert.product_image.admin.component.html',
  styleUrls: ['./insert.product_image.admin.component.css'],

})
export class InsertProductImageAdminComponent implements OnInit {
  insertProductImageDTO: InsertProductImageDTO = {
    product_id: 1,
    images: []
  };
  keyword:string = '';
  products: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService
  ) {

  }
  ngOnInit() {
    this.getProducts(this.keyword, 0, 1, 100);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        // Gán danh sách sản phẩm từ response cho mảng products
        this.products = response.products;
        console.log(this.products);
        // Hiển thị các sản phẩm được lấy được từ dịch vụ trong dropdown menu
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }


  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 5) {
      alert('Please select a maximum of 5 images.');
      return;
    }else{
      if (files && files.length > 0) {
        // Lặp qua từng tệp đã chọn và lấy tên của nó
        for (let i = 0; i < files.length; i++) {
          const fileName: string = files[i].name; // Lấy tên của tệp
          console.log("Selected file name:", fileName);

          // Thêm tên của tệp vào mảng tên ảnh trong insertProductDTO
          this.insertProductImageDTO.images.push(files[i]);
        }
      }
    }
    // Store the selected files in the newProduct object

  }

  insertImages() {
    if (this.insertProductImageDTO.images.length > 0) {
      const productId = this.insertProductImageDTO.product_id;
      this.productService.uploadImages(productId, this.insertProductImageDTO.images).subscribe({
        next: (imageResponse) => {
          
          // Xử lý phản hồi khi ảnh được tải lên nếu cần
          this.toastr.success("Thêm ảnh thành công", "Thành công", {
            timeOut: 2000
          });
          // Chuyển hướng trở lại trang trước đó
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          // Xử lý lỗi khi tải ảnh lên
          this.toastr.error("Thêm ảnh thất bại", "Thất bại", {
            timeOut: 2000
          });
          console.error('Lỗi khi tải ảnh lên:', error);
        }
      })
    }
  }

}

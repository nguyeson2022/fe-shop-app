import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertCategoryDTO } from '../../../../dtos/category/insert.category.dto';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ProductService } from '../../../../services/product.service';
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss']
})

export class InsertCategoryAdminComponent implements OnInit {
  insertCategoryDTO: InsertCategoryDTO = {
    name: '',
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

  }

  insertCategory() {
    this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
      next: (response) => {
        
        this.router.navigate(['/admin/categories']);
        this.toastr.success("Thêm danh mục thành công", "Thành công", {
          timeOut: 2000
        });
      },
      error: (error) => {
        
        // Handle error while inserting the category
        alert(error.error)
        console.error('Error inserting category:', error);
        this.toastr.error("Thêm danh mục thất bại", "Thất bại", {
          timeOut: 2000
        });
      }
    });
  }
}

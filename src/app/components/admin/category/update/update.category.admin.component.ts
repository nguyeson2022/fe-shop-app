import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCategoryDTO } from '../../../../dtos/category/update.category.dto';
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-detail.category.admin',
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss']
})

export class UpdateCategoryAdminComponent implements OnInit {
  categoryId: number;
  category: Category;
  updatedCategory: Category;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.categoryId = 0;
    this.category = {} as Category;
    this.updatedCategory = {} as Category;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      
      this.categoryId = Number(params.get('id'));
      this.getCategoryDetails();
    });

  }

  navigateToUpdateImage(): void {
    this.router.navigate(['/admin/categories/upload/', this.categoryId]);
  }

  getCategoryDetails(): void {
    this.categoryService.getDetailCategory(this.categoryId).subscribe({
      next: (category: Category) => {
        this.category = {...category };

      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }
  updateCategory() {
    // Implement your update logic here
    const updateCategoryDTO: UpdateCategoryDTO = {
      name: this.category.name,
    };
    this.categoryService.updateCategory(this.category.id, updateCategoryDTO).subscribe({
      next: (response: any) => {
        
      },
      complete: () => {
        ;
        this.router.navigate(['/admin/categories']);
        this.toastr.success("Cập nhật danh mục thành công", "Thành công", {
          timeOut: 2000
        });
      },
      error: (error: any) => {
        ;
        console.error('Error fetching categorys:', error);
        this.toastr.error("Cập nhật danh mục thất bại", "Thất bại", {
          timeOut: 2000
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

// Services
import { UserService } from "../../services/user.service";
import { TokenService } from "../../services/token.service";
import { CategoryService } from "../../services/category.service";

// Models and Responses
import { Category } from "../../models/category";
import { UserResponse } from "../../responses/user/user.response";

// External Modules
import { NgbDropdownModule, NgbNavModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    RouterLink,
    NgbDropdownModule,
    NgbNavModule,
    NgbPopoverModule
  ]
})
export class HeaderComponent implements OnInit{
  userResponse?:UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  selectedCategoryId: number = 0;
  categories: Category[] = [];
  keyword: string = '';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.getCategories(1,100);
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //alert(`Clicked on "${index}"`);
    if(index === 0) {
      console.log(index)
      this.router.navigate(['/user-profile']);
    }else if (index === 1) {
      const userId = this.tokenService.getUserId();
      this.router.navigate(['/orders', userId]);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item
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

  onSearch(): void {
    this.router.navigate(['/product-list'], {
      queryParams: {
        keyword: this.keyword,
        categoryId: this.selectedCategoryId
      }
    });
  }
  setActiveNavItem(index: number) {
    this.activeNavItem = index;
    //alert(this.activeNavItem);
  }
}

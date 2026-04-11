import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LocalStorageService } from "ngx-webstorage";
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';
import { ToastrService } from "ngx-toastr";
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],

})
export class OrderAdminComponent implements OnInit {
  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
  localStorage?: LocalStorageService;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService
  ) {
    // this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit(): void {
    let storedPage = Number(localStorage.getItem('currentOrderAdminPage')) || 1;
    this.currentPage = Math.max(1, storedPage); // Ensure currentPage from localStorage is at least 1
    // Initial fetch. The actual validation against totalPages will happen in the getAllOrders callback.
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  searchOrders() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    //Mediocre Iron Wallet
    
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  getAllOrders(keyword: string, page: number, limit: number) {
    
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.orders = response.orders;
        this.totalPages = response.totalPages;
        // Ensure currentPage is within valid bounds after fetching totalPages
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
          // Optionally, you could re-fetch data for the new currentPage if it changed significantly
          // However, for now, we'll just adjust it for the next pagination rendering.
          // If it was an invalid page request that returned empty, this will correct future requests.
        } else if (this.totalPages === 0 && this.currentPage > 1) {
          // if totalPages is 0 (no results), currentPage should be 1
          this.currentPage = 1;
        }
        localStorage.setItem('currentOrderAdminPage', String(this.currentPage)); // Update localStorage with potentially corrected page
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        ;
        console.error('Error fetching products:', error);
      }
    });
  }
  onPageChange(page: number) {
    // Ensure page is at least 1
    let newPage = Math.max(1, page);
    // Ensure page does not exceed totalPages (if totalPages is known and greater than 0)
    if (this.totalPages > 0) {
      newPage = Math.min(newPage, this.totalPages);
    }
    // Only fetch if the page actually changes and is valid
    if (newPage !== this.currentPage || this.orders.length === 0 && newPage === 1) { 
        this.currentPage = newPage;
        localStorage.setItem('currentOrderAdminPage', String(this.currentPage));
        this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
    } else if (newPage === this.currentPage && this.totalPages > 0 && newPage > this.totalPages) {
        // This case handles if somehow onPageChange was called with a page > totalPages
        // but currentPage was already clamped in a previous call. We should re-clamp and fetch.
        this.currentPage = this.totalPages;
        localStorage.setItem('currentOrderAdminPage', String(this.currentPage));
        this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
    }
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  deleteOrder(id: number) {
    const confirmation = window
      .confirm('Bạn chắc chắn muốn xóa đơn hàng này ?');
    if (confirmation) {
      
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          
          this.toastr.success("Xóa đơn hàng thành công", "Thành công", {
            timeOut: 2000
          });
          location.reload();
        },
        complete: () => {
          ;
        },
        error: (error: any) => {
          ;
          this.toastr.error("Xóa đơn hàng thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    }
  }
  viewDetails(order: OrderResponse) {
    
    this.router.navigate(['/admin/orders', order.id]);
  }


  generateExcel() {
    const confirmation = window
      .confirm('Bạn chắc chắn muốn xuất báo cáo này ?');
    if (confirmation) {
      this.reportService.generateExcel().subscribe(
        (data: Blob) => {
          this.downloadFile(data);
        },
        error => {
          console.error('Error downloading the Excel file:', error);
          // Xử lý lỗi nếu có
        }
      );
    }
  }

  private downloadFile(data: Blob) {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.xls';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'PROCESSING':
        return '#1E90FF';
      case 'SHIPPED':
        return '#87CEEB';
      case 'DELIVERED':
        return '#32CD32';
      case 'COMPLETED':
        return '#90EE90';
      case 'CANCELLED':
        return '#FF4500';
      case 'FAILED':
        return '#FF0000';
      case 'PAID':
        return '#4CAF50';
      default:
        return '#6c757d';
    }
  }

  getVietnameseOrderStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPED':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã nhận hàng';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'FAILED':
        return 'Thất bại';
      case 'PAID':
        return 'Đã thanh toán';
      default:
        return status;
    }
  }

}

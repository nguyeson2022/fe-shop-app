import { Component, OnInit } from '@angular/core';
import { DashBoardService } from '../../../services/dashboard.service';
import { ChartTotalResponse } from '../../../responses/order/chart.order.response';
import Chart from 'chart.js/auto';
import { CategoryAmountResponse } from '../../../responses/category/char.category.response';

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard.admin.component.html',
    styleUrls: [
        './dashboard.admin.component.css',
    ],
})
export class DashboardAdminComponent implements OnInit {

    constructor(
        private dashboardService: DashBoardService,
    ) { }
    chartData: ChartTotalResponse[] = [];
    totalProducts: number = 0;
    totalUsers: number = 0;
    totalCategories: number = 0;
    totalMoney: number = 0;
    totalMoneyData: ChartTotalResponse[] = [];
    year: number = 2024;
    chartLabels: string[] = [];
    chartValues: number[] = [];
    totalOrders: number = 0;
    month: number = 0;
    dataUpdated: boolean = false;
    
    // Chart instance để có thể destroy và tạo lại
    revenueChart: any;
    
    // Fake data doanh thu theo tháng (chỉ tháng 7,8,9,10 có doanh thu)
    fakeRevenueData: { [key: number]: ChartTotalResponse[] } = {
        1: [], // Tháng 1: 0 doanh thu
        2: [], // Tháng 2: 0 doanh thu
        3: [], // Tháng 3: 0 doanh thu
        4: [], // Tháng 4: 0 doanh thu
        5: [], // Tháng 5: 0 doanh thu
        6: [], // Tháng 6: 0 doanh thu
        7: [   // Tháng 7: có doanh thu
            { month: 1, totalMoney: 0 },
            { month: 2, totalMoney: 0 },
            { month: 3, totalMoney: 0 },
            { month: 4, totalMoney: 0 },
            { month: 5, totalMoney: 0 },
            { month: 6, totalMoney: 0 },
            { month: 7, totalMoney: 3200000 },
            { month: 8, totalMoney: 0 },
            { month: 9, totalMoney: 0 },
            { month: 10, totalMoney: 0 },
            { month: 11, totalMoney: 0 },
            { month: 12, totalMoney: 0 }
        ],
        8: [   // Tháng 8: có doanh thu
            { month: 1, totalMoney: 0 },
            { month: 2, totalMoney: 0 },
            { month: 3, totalMoney: 0 },
            { month: 4, totalMoney: 0 },
            { month: 5, totalMoney: 0 },
            { month: 6, totalMoney: 0 },
            { month: 7, totalMoney: 3200000 },
            { month: 8, totalMoney: 4800000 },
            { month: 9, totalMoney: 0 },
            { month: 10, totalMoney: 0 },
            { month: 11, totalMoney: 0 },
            { month: 12, totalMoney: 0 }
        ],
        9: [   // Tháng 9: có doanh thu
            { month: 1, totalMoney: 0 },
            { month: 2, totalMoney: 0 },
            { month: 3, totalMoney: 0 },
            { month: 4, totalMoney: 0 },
            { month: 5, totalMoney: 0 },
            { month: 6, totalMoney: 0 },
            { month: 7, totalMoney: 3200000 },
            { month: 8, totalMoney: 4800000 },
            { month: 9, totalMoney: 4100000 },
            { month: 10, totalMoney: 0 },
            { month: 11, totalMoney: 0 },
            { month: 12, totalMoney: 0 }
        ],
        10: [  // Tháng 10: có doanh thu (thấp nhất vì mới đầu tháng)
            { month: 1, totalMoney: 0 },
            { month: 2, totalMoney: 0 },
            { month: 3, totalMoney: 0 },
            { month: 4, totalMoney: 0 },
            { month: 5, totalMoney: 0 },
            { month: 6, totalMoney: 0 },
            { month: 7, totalMoney: 3200000 },
            { month: 8, totalMoney: 4800000 },
            { month: 9, totalMoney: 4100000 },
            { month: 10, totalMoney: 750000 },
            { month: 11, totalMoney: 0 },
            { month: 12, totalMoney: 0 }
        ],
        11: [], // Tháng 11: 0 doanh thu
        12: []  // Tháng 12: 0 doanh thu
    };
    
    // Fake data tổng doanh thu theo tháng (doanh thu của tháng hiện tại)
    fakeTotalMoneyByMonth: { [key: number]: number } = {
        1: 0,        // Tháng 1: 0 VNĐ
        2: 0,        // Tháng 2: 0 VNĐ
        3: 0,        // Tháng 3: 0 VNĐ
        4: 0,        // Tháng 4: 0 VNĐ
        5: 0,        // Tháng 5: 0 VNĐ
        6: 0,        // Tháng 6: 0 VNĐ
        7: 3200000,  // Tháng 7: 3.2M VNĐ
        8: 4800000,  // Tháng 8: 4.8M VNĐ
        9: 4100000,  // Tháng 9: 4.1M VNĐ
        10: 750000,  // Tháng 10: 750K VNĐ (thấp nhất - mới đầu tháng)
        11: 0,       // Tháng 11: 0 VNĐ
        12: 0        // Tháng 12: 0 VNĐ
    };
    
    // Fake data số lượng order theo tháng
    fakeTotalOrdersByMonth: { [key: number]: number } = {
        1: 0,   // Tháng 1: 0 đơn hàng
        2: 0,   // Tháng 2: 0 đơn hàng
        3: 0,   // Tháng 3: 0 đơn hàng
        4: 0,   // Tháng 4: 0 đơn hàng
        5: 0,   // Tháng 5: 0 đơn hàng
        6: 0,   // Tháng 6: 0 đơn hàng
        7: 8,   // Tháng 7: 8 đơn hàng
        8: 12,  // Tháng 8: 12 đơn hàng (cao nhất)
        9: 10,  // Tháng 9: 10 đơn hàng
        10: 2,  // Tháng 10: 2 đơn hàng (thấp nhất - mới đầu tháng)
        11: 0,  // Tháng 11: 0 đơn hàng
        12: 0   // Tháng 12: 0 đơn hàng
    };

    data: any = {
        labels: [],
        datasets: [{
            label: 'Số lượng sản phẩm',
            data: [],
            backgroundColor: [],
            hoverOffset: 4
        }]
    };

    onMonthChange(event: any) {
        // event.value là giá trị vừa chọn
        this.month = event.value;
        console.log('Tháng được chọn:', this.month);
        
        // Cập nhật dữ liệu và chart khi thay đổi tháng
        this.updateData();
        this.updateRevenueChart();
        
        // Cập nhật tổng doanh thu và số đơn hàng ngay lập tức
        this.totalMoney = this.fakeTotalMoneyByMonth[this.month] || 0;
        this.totalOrders = this.fakeTotalOrdersByMonth[this.month] || 0;
    }
    months = [
        { value: 1, label: 'Tháng 1' },
        { value: 2, label: 'Tháng 2' },
        { value: 3, label: 'Tháng 3' },
        { value: 4, label: 'Tháng 4' },
        { value: 5, label: 'Tháng 5' },
        { value: 6, label: 'Tháng 6' },
        { value: 7, label: 'Tháng 7' },
        { value: 8, label: 'Tháng 8' },
        { value: 9, label: 'Tháng 9' },
        { value: 10, label: 'Tháng 10' },
        { value: 11, label: 'Tháng 11' },
        { value: 12, label: 'Tháng 12' },
    ];

    ngOnInit() {
        this.month = new Date().getMonth() + 1; // Thiết lập tháng hiện tại
        this.year = new Date().getFullYear();
        
        // Thiết lập tổng doanh thu và số đơn hàng ban đầu từ fake data
        this.totalMoney = this.fakeTotalMoneyByMonth[this.month] || 0;
        this.totalOrders = this.fakeTotalOrdersByMonth[this.month] || 0;
        
        this.updateData();
        this.getTotalMoneyByMonth(); // Sẽ sử dụng fake data
        this.getProductAmountByCategory();
        this.getTotalProduct();
        this.getTotalUser();
        this.getTotalOrdersByMonth();
        this.getTotalMoney()
    }
    updateData() {
        this.dataUpdated = true;
        this.getTotalOrdersByMonth();
        this.getTotalMoney();
    }





    getTotalProduct() {
        this.dashboardService.getTotalProduct().subscribe((count: number) => {
            this.totalProducts = count;
        })
    }
    getTotalUser() {
        this.dashboardService.getTotalUser().subscribe((count: number) => {
            this.totalUsers = count;
        })
    }
    getTotalCategory() {
        this.dashboardService.getTotalCategory().subscribe((count: number) => {
            this.totalCategories = count;
        })
    }

    getTotalOrdersByMonth() {
        if (this.dataUpdated) {
            // Sử dụng fake data thay vì gọi API
            this.totalOrders = this.fakeTotalOrdersByMonth[this.month] || 0;
            console.log(`Fake tổng đơn hàng tháng ${this.month}:`, this.totalOrders);
        }
    }
    getTotalMoney() {
        if (this.dataUpdated) {
            // Sử dụng fake data thay vì gọi API
            this.totalMoney = this.fakeTotalMoneyByMonth[this.month] || 0;
            console.log(`Fake tổng doanh thu tháng ${this.month}:`, this.totalMoney);
        }
    }

    //Chart 1
    getTotalMoneyByMonth() {
        // Sử dụng fake data thay vì gọi API
        this.updateRevenueChart();
    }
    
    updateRevenueChart() {
        // Lấy fake data dựa vào tháng hiện tại
        const currentMonthData = this.fakeRevenueData[this.month] || [];
        
        // Nếu không có data cho tháng này, tạo data với tất cả = 0
        if (currentMonthData.length === 0) {
            this.chartData = [];
            for (let i = 1; i <= 12; i++) {
                this.chartData.push({ month: i, totalMoney: 0 });
            }
        } else {
            this.chartData = currentMonthData;
        }
        
        this.prepareChartData();
    }

    prepareChartData() {
        this.chartLabels = this.chartData.map(item => `Tháng ${item.month}`);
        this.chartValues = this.chartData.map(item => item.totalMoney);
        this.renderChart();
    }

    renderChart() {
        // Destroy chart cũ nếu có
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
        
        const colors = this.generateRandomColors(this.chartData.length);
        this.revenueChart = new Chart("myChart", {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: `Doanh thu năm ${this.year} (Tháng hiện tại: ${this.month})`,
                    data: this.chartValues,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value: any) {
                                return new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(value);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                return 'Doanh thu: ' + new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(context.parsed.y);
                            }
                        }
                    }
                }
            }
        });
    }
    generateRandomColors(count: number): string[] {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(randomColor);
        }
        return colors;
    }



    //Chart 2
    getProductAmountByCategory() {
        this.dashboardService.getProductAmountByCategory().subscribe(
            (response: CategoryAmountResponse[]) => {
                response.forEach(item => {
                    this.data.labels.push(item.category);
                    this.data.datasets[0].data.push(item.amount);
                    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    this.data.datasets[0].backgroundColor.push(randomColor);
                });
                this.renderChartPie();
            },
            (error) => {
                console.error('Error fetching product amount by category:', error);
            }
        );
    }

    renderChartPie() {
        new Chart('myPieChart', {
            type: 'doughnut',
            data: this.data,
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

}
